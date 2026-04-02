import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination, resolveSortAndFilter } from '../../common';
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

        const { isRead } = value;
        const { criteria, options, page, limit } = resolveSortAndFilter(value, ['name', 'email']);

        if (isRead === true) criteria.isRead = true;
        if (isRead === false) criteria.isRead = false;

        const response = await getData(contactModel, criteria, {}, options);
        const totalCount = await countData(contactModel, criteria);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('Contact'), { contact_data: response, totalData: totalCount, state: resolvePagination(page, limit) }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};
