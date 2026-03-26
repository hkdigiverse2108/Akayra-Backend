"use strict"
import { Request, Response } from 'express'
import { userModel, userSessionModel } from '../../database'
import { apiResponse, HTTP_STATUS, getUniqueOtp, getOtpExpireTime, generateHash, compareHash, generateToken } from '../../common'
import { email_verification_mail, reqInfo, responseMessage, getFirstMatch, createData, updateData } from '../../helper'

export const signUp = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body, otp
    try {

        let isAlready: any = await getFirstMatch(userModel, { email: body?.email, isActive: true }, {}, {})
        if (isAlready) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.alreadyEmail, {}, {}))

        isAlready = await getFirstMatch(userModel, { phoneNumber: body?.phoneNumber, isActive: true }, {}, {})
        if (isAlready) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, "phone number exist already", {}, {}))

        if (isAlready?.isBlock == true) return res.status(HTTP_STATUS.FORBIDDEN).json(new apiResponse(HTTP_STATUS.FORBIDDEN, responseMessage?.accountBlock, {}, {}))

        const hashPassword = await generateHash(body.password)
        delete body.password
        body.password = hashPassword
        let response: any = await createData(userModel, body)
        response = {
            userType: response?.userType,
            isEmailVerified: response?.isEmailVerified,
            _id: response?._id,
            email: response?.email,
        }

        otp = await getUniqueOtp();

        let result: any = await email_verification_mail(response, otp);
        if (result) {
            await updateData(userModel, body, { otp, otpExpireTime: new Date(new Date().setMinutes(new Date().getMinutes() + 10)) }, {})
            return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, `${result}`, {}, {}));
        }
        else return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(new apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.errorMail, {}, `${result}`));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error))
    }
}

export const otp_verification = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body
    try {
        body.isActive = true
        let data: any = await getFirstMatch(userModel, body, {}, {});
        if (!data) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage?.invalidOTP, {}, {}))
        if (data.isBlock == true) return res.status(HTTP_STATUS.FORBIDDEN).json(new apiResponse(HTTP_STATUS.FORBIDDEN, responseMessage?.accountBlock, {}, {}))
        if (new Date(data.otpExpireTime).getTime() < new Date().getTime()) return res.status(HTTP_STATUS.GONE).json(new apiResponse(HTTP_STATUS.GONE, responseMessage?.expireOTP, {}, {}))
        if (data) {
            let response: any = await updateData(userModel, body, { otp: null, otpExpireTime: null, isEmailVerified: true, isLoggedIn: true }, {});
            const token = await generateToken({
                _id: response._id,
                type: response.userType,
                status: "Login",
                generatedOn: (new Date().getTime())
            })

            let result = {
                isEmailVerified: response?.isEmailVerified,
                userType: response?.userType,
                _id: response?._id,
                email: response?.email,
                token,
            }
            return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage?.OTPVerified, result, {}))
        }

    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error))
    }
}

export const login = async (req: Request, res: Response) => { //email or password // phone or password
    let body = req.body,
        response: any
    reqInfo(req)
    try {
        response = await updateData(userModel, { email: body?.email, isActive: true, userType: 0 }, { $addToSet: { deviceToken: body?.deviceToken }, isLoggedIn: true }, { select: '-__v -createdAt -updatedAt' })

        if (!response) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage?.invalidUserPasswordEmail, {}, {}))
        if (response?.isBlock == true) return res.status(HTTP_STATUS.FORBIDDEN).json(new apiResponse(HTTP_STATUS.FORBIDDEN, responseMessage?.accountBlock, {}, {}))

        const passwordMatch = await compareHash(body.password, response.password)
        if (!passwordMatch) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage?.invalidUserPasswordEmail, {}, {}))
        const token = await generateToken({
            _id: response._id,
            type: response.userType,
            status: "Login",
            generatedOn: (new Date().getTime())
        })

        await createData(userSessionModel, {
            createdBy: response._id,
        })
        response = {
            isEmailVerified: response?.isEmailVerified,
            userType: response?.userType,
            _id: response?._id,
            email: response?.email,
            token,
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage?.loginSuccess, response, {}))

    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error))
    }
}

export const forgot_password = async (req: Request, res: Response) => {
    reqInfo(req);
    let body = req.body, otp = 0
    try {
        body.isActive = true;
        let data: any = await getFirstMatch(userModel, body, {}, {});

        if (!data) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage?.invalidEmail, {}, {}));
        }
        if (data.isBlock == true) {
            return res.status(HTTP_STATUS.FORBIDDEN).json(new apiResponse(HTTP_STATUS.FORBIDDEN, responseMessage?.accountBlock, {}, {}));
        }

        otp = await getUniqueOtp();
        let response: any = { sendMail: true }
        if (response) {
            await updateData(userModel, body, { otp, otpExpireTime: getOtpExpireTime() }, {})
            return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, `${response}`, {}, {}));
        }
        else return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(new apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.errorMail, {}, `${response}`));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error));
    }
};

export const reset_password = async (req: Request, res: Response) => {
    reqInfo(req)
    let body = req.body
    try {
        const hashPassword = await generateHash(body.password)
        delete body.password
        delete body.id
        body.password = hashPassword

        let response: any = await updateData(userModel, { email: body?.email, isActive: true, otp: null }, body, {})
        if (!response) return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(new apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.resetPasswordError, {}, {}))
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage?.resetPasswordSuccess, response, {}))

    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error))
    }
}


export const adminSignUp = async (req: Request, res: Response) => {
    reqInfo(req)
    try {
        let body = req.body,
            otp;
        let isAlready: any = await getFirstMatch(userModel, { email: body?.email, isActive: true, userType: 1 }, {}, {})
        if (isAlready) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.alreadyEmail, {}, {}))

        if (isAlready?.isBlock == true) return res.status(HTTP_STATUS.FORBIDDEN).json(new apiResponse(HTTP_STATUS.FORBIDDEN, responseMessage?.accountBlock, {}, {}))

        const hashPassword = await generateHash(body.password)
        delete body.password
        body.password = hashPassword
        body.userType = 1  //to specify this user is admin
        let response: any = await createData(userModel, body)
        response = {
            userType: response?.userType,
            isEmailVerified: response?.isEmailVerified,
            _id: response?._id,
            email: response?.email,
        }

        otp = await getUniqueOtp();

        let result: any = await email_verification_mail(response, otp);
        if (result) {
            await updateData(userModel, body, { otp, otpExpireTime: getOtpExpireTime() }, {})
            return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, `${result}`, {}, {}));
        }
        else return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(new apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.errorMail, {}, `${result}`));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error))
    }
}

export const adminLogin = async (req: Request, res: Response) => { //email or password // phone or password
    let body = req.body,
        response: any
    reqInfo(req)
    try {
        response = await updateData(userModel, { email: body?.email, userType: 1, isActive: true }, { isLoggedIn: true }, { select: '-__v -createdAt -updatedAt' })

        if (!response) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage?.invalidUserPasswordEmail, {}, {}))
        if (response?.isBlock == true) return res.status(HTTP_STATUS.FORBIDDEN).json(new apiResponse(HTTP_STATUS.FORBIDDEN, responseMessage?.accountBlock, {}, {}))

        const passwordMatch = await compareHash(body.password, response.password)
        if (!passwordMatch) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage?.invalidUserPasswordEmail, {}, {}))
        const token = await generateToken({
            _id: response._id,
            type: response.userType,
            status: "Login",
            generatedOn: (new Date().getTime())
        })

        await createData(userSessionModel, {
            createdBy: response._id,
        })
        response = {
            isEmailVerified: response?.isEmailVerified,
            userType: response?.userType,
            _id: response?._id,
            email: response?.email,
            token,
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage?.loginSuccess, response, {}))

    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error))
    }
}