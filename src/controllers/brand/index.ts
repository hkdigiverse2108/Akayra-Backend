import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination } from '../../common';
import { brandModel } from '../../database';
import { countData, createData, deleteData, getData, getFirstMatch, reqInfo, responseMessage, updateData } from '../../helper';
import { addBrandSchema, editBrandSchema, deleteBrandSchema, getBrandsSchema, getBrandByIdSchema } from '../../validation';

export const add_brand = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addBrandSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let isExist = await getFirstMatch(brandModel, { name: value.name, isDeleted: false }, {}, {});
        if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.dataAlreadyExist("name"), {}, {}));

        const response = await createData(brandModel, value);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.addDataSuccess('Brand'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const edit_brand_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = editBrandSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let isExist = await getFirstMatch(brandModel, { name: value.name, _id: { $ne: isValidObjectId(value.brandId) }, isDeleted: false }, {}, {});
        if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.dataAlreadyExist("name"), {}, {}));

        const response = await updateData(brandModel, { _id: isValidObjectId(value.brandId) }, value, {});
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Brand'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess('Brand'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const delete_brand_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = deleteBrandSchema.validate(req.params || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const response = await deleteData(brandModel, { _id: isValidObjectId(value.id) });
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Brand'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess('Brand'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_all_brand = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getBrandsSchema.validate(req.query || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let { page, limit, search, sortFilter, activeFilter, startDateFilter, endDateFilter } = value;
        let criteria: any = { isDeleted: false }, options: any = { lean: true };

        if (search) criteria.name = { $regex: search, $options: 'si' };

        if (sortFilter === "nameAsc") options.sort = { name: 1 };
        else if (sortFilter === "nameDesc") options.sort = { name: -1 };
        else options.sort = { createdAt: -1 };

        if (activeFilter === true) criteria.isActive = true;
        if (activeFilter === false) criteria.isActive = false;

        if (startDateFilter && endDateFilter) criteria.createdAt = { $gte: new Date(startDateFilter), $lte: new Date(endDateFilter) };

        if (page && limit) {
            options.skip = (parseInt(page) - 1) * parseInt(limit);
            options.limit = parseInt(limit);
        }

        const response = await getData(brandModel, criteria, {}, options);
        const totalCount = await countData(brandModel, criteria);
        const stateObj = resolvePagination(page, limit);

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('Brand'), {
            brand_data: response, totalData: totalCount, state: stateObj
        }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_brand_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = getBrandByIdSchema.validate(req.params);
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

        const response = await getFirstMatch(brandModel, { _id: isValidObjectId(value.id), isDeleted: false }, {}, {});
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage?.getDataNotFound("Brand"), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage?.getDataSuccess("Brand"), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error));
    }
};
