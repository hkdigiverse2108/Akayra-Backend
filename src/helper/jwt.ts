import { HTTP_STATUS, apiResponse, isValidObjectId, verifyToken } from '../common'
import { Request, Response } from 'express'
import { responseMessage } from './response'
import { getFirstMatch } from './database-service';
import { userModel } from '../database';

export const adminJWT = async (req: Request, res: Response, next) => {
    let { authorization } = req.headers,
        result: any;
    try {
        if (!authorization) return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage?.tokenNotFound, {}, {}));

        let isVerifyToken = verifyToken(authorization);
        result = await getFirstMatch(userModel, { _id: isValidObjectId(isVerifyToken._id), isDeleted: false }, {}, {});

        if (result?.isActive === false) return res.status(HTTP_STATUS.FORBIDDEN).json(new apiResponse(HTTP_STATUS.FORBIDDEN, responseMessage?.accountBlock, {}, {}));

        req.headers.user = result;
        return next();
    } catch (error) {
        console.log(error);
        if (error.message === "invalid signature") return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.invalidToken, {}, {}));
        else if (error.name === "TokenExpiredError") return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.tokenExpire, {}, {}));
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.invalidToken, {}, {}));
    }
};

export const userJWT = async (req: Request, res: Response, next) => {
    let { authorization } = req.headers,
        result: any;
    try {
        if (!authorization) return next();

        let isVerifyToken = verifyToken(authorization);
        result = await getFirstMatch(userModel, { _id: isValidObjectId(isVerifyToken._id), isDeleted: false }, {}, {});

        if (result?.isActive === false) return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage?.accountBlock, {}, {}));

        req.headers.user = result;
        return next();
    } catch (error) {
        console.log(error);
        if (error.message === "invalid signature") return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.invalidToken, {}, {}));
        else if (error.name === "TokenExpiredError") return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.tokenExpire, {}, {}));
        return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.invalidToken, {}, {}));
    }
};
