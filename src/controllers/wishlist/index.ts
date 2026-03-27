import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination } from '../../common';
import { wishlistModel } from '../../database';
import { countData, createData, deleteData, getData, getFirstMatch, reqInfo, responseMessage } from '../../helper';
import { addWishlistSchema, removeWishlistSchema, getWishlistSchema } from '../../validation';

export const add_to_wishlist = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addWishlistSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const userId = req?.user?._id;
        let isExist = await getFirstMatch(wishlistModel, { userId: isValidObjectId(userId.toString()), productId: isValidObjectId(value.productId), isDeleted: false }, {}, {});
        if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, 'Product already in wishlist', {}, {}));

        const response = await createData(wishlistModel, { userId, productId: value.productId });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, 'Added to wishlist', response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const remove_from_wishlist = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = removeWishlistSchema.validate(req.params || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const response = await deleteData(wishlistModel, { _id: isValidObjectId(value.id) });
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Wishlist item'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, 'Removed from wishlist', response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_my_wishlist = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getWishlistSchema.validate(req.query || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const userId = req?.user?._id;
        let { page, limit } = value;
        let options: any = { lean: true, sort: { createdAt: -1 } };
        if (page && limit) { options.skip = (parseInt(page) - 1) * parseInt(limit); options.limit = parseInt(limit); }

        const criteria = { userId: isValidObjectId(userId.toString()), isDeleted: false };
        const response = await getData(wishlistModel, criteria, {}, options);
        const totalCount = await countData(wishlistModel, criteria);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('Wishlist'), { wishlist_data: response, totalData: totalCount, state: resolvePagination(page, limit) }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};
