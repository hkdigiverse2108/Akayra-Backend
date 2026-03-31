import { HTTP_STATUS, USER_ROLES, apiResponse, isValidObjectId, resolvePagination } from '../../common';
import { userModel } from '../../database';
import { countData, createData, deleteData, getData, getFirstMatch, reqInfo, responseMessage, updateData } from '../../helper';
import { addUserSchema, editUserSchema, deleteUserSchema, getUsersSchema, getUserByIdSchema } from '../../validation';
import bcrypt from 'bcryptjs';

export const add_user = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addUserSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let isExist = await getFirstMatch(userModel, { email: value.email, isDeleted: false }, {}, {});
        if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.alreadyEmail, {}, {}));

        if (value.password) {
            const salt = await bcrypt.genSalt(10);
            value.password = await bcrypt.hash(value.password, salt);
        }

        const response = await createData(userModel, value);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.addDataSuccess('user'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const edit_user_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editUserSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        if (value.email) {
            let isExist = await getFirstMatch(userModel, { email: value.email, _id: { $ne: isValidObjectId(value.userId) }, isDeleted: false }, {}, {});
            if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.alreadyEmail, {}, {}));
        }

        if (value.password) {
            const salt = await bcrypt.genSalt(10);
            value.password = await bcrypt.hash(value.password, salt);
        }

        const response = await updateData(userModel, { _id: isValidObjectId(value.userId) }, value, {});
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('user'), {}, {}));

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess('user'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const delete_user_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteUserSchema.validate(req.params || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const response = await deleteData(userModel, { _id: isValidObjectId(value.id) });
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('user'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess('user'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_all_user = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getUsersSchema.validate(req.query || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let { page, limit, search, sortFilter, activeFilter } = value;
        let criteria: any = { isDeleted: false, role: { $ne: USER_ROLES.ADMIN } }, options: any = { lean: true };

        if (search) {
            criteria.$or = [
                { firstName: { $regex: search, $options: 'si' } },
                { lastName: { $regex: search, $options: 'si' } },
                { email: { $regex: search, $options: 'si' } }
            ];
        }

        if (sortFilter === "nameAsc") options.sort = { firstName: 1 };
        else if (sortFilter === "nameDesc") options.sort = { firstName: -1 };
        else options.sort = { createdAt: -1 };

        if (activeFilter === true) criteria.isActive = true;
        if (activeFilter === false) criteria.isActive = false;

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }

        const response = await getData(userModel, criteria, {}, options);
        const totalCount = await countData(userModel, criteria);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('user'), {
            user_data: response,
            totalData: totalCount,
            state: resolvePagination(page, limit)
        }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_user_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getUserByIdSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

        const response = await getFirstMatch(userModel, { _id: isValidObjectId(value.id), isDeleted: false }, {}, {});
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage?.getDataNotFound("user"), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage?.getDataSuccess("user"), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error));
    }
};
