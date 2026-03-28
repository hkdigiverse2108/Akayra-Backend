import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination } from '../../common';
import { newsletterModel } from '../../database';
import { countData, createData, deleteData, getData, getFirstMatch, reqInfo, responseMessage } from '../../helper';
import { subscribeNewsletterSchema, deleteNewsletterSchema, getNewsletterSchema } from '../../validation';

export const subscribe_newsletter = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = subscribeNewsletterSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let isExist = await getFirstMatch(newsletterModel, { email: value.email, isDeleted: false }, {}, {});
        if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.dataAlreadyExist("email"), {}, {}));

        const response = await createData(newsletterModel, value);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, 'Subscribed successfully', response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const delete_newsletter_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteNewsletterSchema.validate(req.params || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));
        const response = await deleteData(newsletterModel, { _id: isValidObjectId(value.id) });
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Newsletter'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess('Newsletter'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_all_newsletter = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getNewsletterSchema.validate(req.query || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let { page, limit, search } = value;
        let criteria: any = { isDeleted: false }, options: any = { lean: true, sort: { createdAt: -1 } };
        if (search) criteria.email = { $regex: search, $options: 'si' };
        if (value.startDateFilter && value.endDateFilter) {
            criteria.createdAt = { $gte: new Date(value.startDateFilter), $lte: new Date(value.endDateFilter) };
        }
        if (page && limit) { options.skip = (parseInt(page) - 1) * parseInt(limit); options.limit = parseInt(limit); }

        const response = await getData(newsletterModel, criteria, {}, options);
        const totalCount = await countData(newsletterModel, criteria);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('Newsletter'), { newsletter_data: response, totalData: totalCount, state: resolvePagination(page, limit) }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};
