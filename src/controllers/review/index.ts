import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination } from '../../common';
import { reviewModel, productModel } from '../../database';
import { countData, createData, deleteData, getData, getFirstMatch, reqInfo, responseMessage, updateData } from '../../helper';
import { addReviewSchema, editReviewSchema, deleteReviewSchema, getReviewsSchema, getReviewByIdSchema } from '../../validation';

export const add_review = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addReviewSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        // Validate product exists
        const product = await getFirstMatch(productModel, { _id: isValidObjectId(value.productId), isDeleted: false }, {}, {});
        if (!product) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Product'), {}, {}));

        const response = await createData(reviewModel, value);

        // Update product average rating
        const allReviews: any = await getData(reviewModel, { productId: isValidObjectId(value.productId), isDeleted: false }, { rating: 1 }, { lean: true });
        if (allReviews.length > 0) {
            const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
            await updateData(productModel, { _id: isValidObjectId(value.productId) }, { rating: parseFloat(avgRating.toFixed(1)) }, {});
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.addDataSuccess('Review'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const edit_review_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editReviewSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const response = await updateData(reviewModel, { _id: isValidObjectId(value.reviewId) }, value, {});
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Review'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess('Review'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const delete_review_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteReviewSchema.validate(req.params || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const response = await deleteData(reviewModel, { _id: isValidObjectId(value.id) });
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Review'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess('Review'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_all_review = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getReviewsSchema.validate(req.query || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let { page, limit, productId, activeFilter } = value;
        let criteria: any = { isDeleted: false }, options: any = { lean: true, sort: { createdAt: -1 } };

        if (productId) criteria.productId = isValidObjectId(productId);
        if (activeFilter === true || activeFilter === undefined) criteria.isActive = true;
        else if (activeFilter === false) criteria.isActive = false;

        if (value.startDateFilter && value.endDateFilter) {
            criteria.createdAt = { $gte: new Date(value.startDateFilter), $lte: new Date(value.endDateFilter) };
        }

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }

        const response = await getData(reviewModel, criteria, {}, options);
        const totalCount = await countData(reviewModel, criteria);
        const stateObj = resolvePagination(page, limit);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('Review'), {
            review_data: response,
            totalData: totalCount,
            state: stateObj
        }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_review_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getReviewByIdSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

        const response = await getFirstMatch(reviewModel, { _id: isValidObjectId(value.id), isDeleted: false }, {}, {});
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage?.getDataNotFound("Review"), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage?.getDataSuccess("Review"), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error));
    }
};
