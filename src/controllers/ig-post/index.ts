import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination } from '../../common';
import { igPostModel } from '../../database';
import { countData, createData, deleteData, getData, getFirstMatch, reqInfo, responseMessage, updateData } from '../../helper';
import { addIgPostSchema, editIgPostSchema, deleteIgPostSchema, getIgPostByIdSchema, getIgPostsSchema } from '../../validation';

export const add_ig_post = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addIgPostSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));
        const response = await createData(igPostModel, value);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.addDataSuccess('Instagram Post'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const edit_ig_post_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editIgPostSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));
        const response = await updateData(igPostModel, { _id: isValidObjectId(value.igPostId) }, value, {});
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Instagram Post'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess('Instagram Post'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const delete_ig_post_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteIgPostSchema.validate(req.params || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));
        const response = await deleteData(igPostModel, { _id: isValidObjectId(value.id) });
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Instagram Post'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess('Instagram Post'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_all_ig_post = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getIgPostsSchema.validate(req.query || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let { activeFilter, page, limit, startDateFilter, endDateFilter } = value;
        let criteria: any = { isDeleted: false }, options: any = { lean: true, sort: { priority: -1, createdAt: -1 } };

        if (activeFilter === true || activeFilter === undefined) criteria.isActive = true;
        else if (activeFilter === false) criteria.isActive = false;

        if (startDateFilter && endDateFilter) {
            criteria.createdAt = { $gte: new Date(startDateFilter), $lte: new Date(endDateFilter) };
        }

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }

        const response = await getData(igPostModel, criteria, {}, options);
        const totalCount = await countData(igPostModel, criteria);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('Instagram Post'), {
            ig_post_data: response,
            totalData: totalCount,
            state: resolvePagination(page, limit)
        }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};
