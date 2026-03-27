import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination } from '../../common';
import { productModel } from '../../database';
import { countData, createData, deleteData, getData, getFirstMatch, reqInfo, responseMessage, updateData } from '../../helper';
import { addProductSchema, editProductSchema, deleteProductSchema, getProductsSchema, getProductByIdSchema } from '../../validation';

export const add_product = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addProductSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        // Auto-calculate discount and netProfit
        value.discount = value.mrp - value.sellingPrice;
        if (value.cogsPrice) value.netProfit = value.sellingPrice - value.cogsPrice;

        const response = await createData(productModel, value);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.addDataSuccess('Product'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const edit_product_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editProductSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        // Auto-recalculate if prices change
        if (value.mrp && value.sellingPrice) value.discount = value.mrp - value.sellingPrice;
        if (value.sellingPrice && value.cogsPrice) value.netProfit = value.sellingPrice - value.cogsPrice;

        const response = await updateData(productModel, { _id: isValidObjectId(value.productId) }, value, {});
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Product'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess('Product'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const delete_product_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteProductSchema.validate(req.params || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const response = await deleteData(productModel, { _id: isValidObjectId(value.id) });
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Product'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess('Product'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_all_product = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getProductsSchema.validate(req.query || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let { page, limit, search, categoryId, brandId, isTrending, isDealOfDay, sortFilter, activeFilter, startDateFilter, endDateFilter } = value;
        let criteria: any = { isDeleted: false }, options: any = { lean: true };

        // Search by product name (keyword) or SKU
        if (search) criteria.$or = [
            { title: { $regex: search, $options: 'si' } },
            { sku: { $regex: search, $options: 'si' } }
        ];

        if (categoryId) criteria.categoryId = isValidObjectId(categoryId);
        if (brandId) criteria.brandId = isValidObjectId(brandId);
        if (isTrending === true) criteria.isTrending = true;
        if (isDealOfDay === true) criteria.isDealOfDay = true;
        if (activeFilter === true) criteria.isActive = true;
        if (activeFilter === false) criteria.isActive = false;
        if (startDateFilter && endDateFilter) criteria.createdAt = { $gte: new Date(startDateFilter), $lte: new Date(endDateFilter) };

        if (sortFilter === "priceAsc") options.sort = { sellingPrice: 1 };
        else if (sortFilter === "priceDesc") options.sort = { sellingPrice: -1 };
        else if (sortFilter === "nameAsc") options.sort = { title: 1 };
        else if (sortFilter === "nameDesc") options.sort = { title: -1 };
        else if (sortFilter === "ratingDesc") options.sort = { rating: -1 };
        else options.sort = { createdAt: -1 };

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }

        const response = await getData(productModel, criteria, {}, options);
        const totalCount = await countData(productModel, criteria);
        const stateObj = resolvePagination(page, limit);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('Product'), {
            product_data: response, totalData: totalCount, state: stateObj
        }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_product_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getProductByIdSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

        const response = await getFirstMatch(productModel, { _id: isValidObjectId(value.id), isDeleted: false }, {}, {});
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage?.getDataNotFound("Product"), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage?.getDataSuccess("Product"), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error));
    }
};
