import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination } from '../../common';
import { contactModel } from '../../database';
import { countData, createData, deleteData, getData, reqInfo, responseMessage, updateData } from '../../helper';
import { addContactSchema, getContactsSchema, deleteContactSchema, markReadContactSchema } from '../../validation';

export const add_contact = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addContactSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const response = await createData(contactModel, value);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, 'Message sent successfully', response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const mark_contact_read = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = markReadContactSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));
        const response = await updateData(contactModel, { _id: isValidObjectId(value.contactId) }, { isRead: true }, {});
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Contact'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, 'Marked as read', response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const delete_contact_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteContactSchema.validate(req.params || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));
        const response = await deleteData(contactModel, { _id: isValidObjectId(value.id) });
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Contact'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess('Contact'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_all_contact = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getContactsSchema.validate(req.query || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let { page, limit, search, isRead } = value;
        let criteria: any = { isDeleted: false }, options: any = { lean: true, sort: { createdAt: -1 } };
        if (search) criteria.$or = [{ name: { $regex: search, $options: 'si' } }, { email: { $regex: search, $options: 'si' } }];
        if (isRead === true) criteria.isRead = true;
        if (isRead === false) criteria.isRead = false;
        if (value.startDateFilter && value.endDateFilter) {
            criteria.createdAt = { $gte: new Date(value.startDateFilter), $lte: new Date(value.endDateFilter) };
        }
        if (page && limit) { options.skip = (parseInt(page) - 1) * parseInt(limit); options.limit = parseInt(limit); }

        const response = await getData(contactModel, criteria, {}, options);
        const totalCount = await countData(contactModel, criteria);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('Contact'), { contact_data: response, totalData: totalCount, state: resolvePagination(page, limit) }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};
