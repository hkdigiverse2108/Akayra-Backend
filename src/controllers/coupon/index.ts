import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination, resolveSortAndFilter } from '../../common';
import { couponModel } from '../../database';
import { countData, createData, deleteData, getData, getFirstMatch, reqInfo, responseMessage, updateData } from '../../helper';
import { addCouponSchema, editCouponSchema, deleteCouponSchema, getCouponsSchema, getCouponByIdSchema, applyCouponSchema } from '../../validation';

export const add_coupon = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = addCouponSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let isExist = await getFirstMatch(couponModel, { code: value.code.toUpperCase(), isDeleted: false }, {}, {});
        if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.dataAlreadyExist("coupon code"), {}, {}));

        value.code = value.code.toUpperCase();
        const response = await createData(couponModel, value);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.addDataSuccess('Coupon'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const edit_coupon_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value = {} } = editCouponSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        if (value.code) value.code = value.code.toUpperCase();
        const response = await updateData(couponModel, { _id: isValidObjectId(value.couponId) }, value, {});
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Coupon'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess('Coupon'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const delete_coupon_by_id = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value = {} } = deleteCouponSchema.validate(req.params || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));
        const response = await deleteData(couponModel, { _id: isValidObjectId(value.id) });
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Coupon'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess('Coupon'), response, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_all_coupon = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value = {} } = getCouponsSchema.validate(req.query || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const { criteria, options, page, limit } = resolveSortAndFilter(value, ['code']);

        const response = await getData(couponModel, criteria, {}, options);
        const totalCount = await countData(couponModel, criteria);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('Coupon'), { coupon_data: response, totalData: totalCount, state: resolvePagination(page, limit) }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};


export const apply_coupon = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = applyCouponSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const coupon: any = await getFirstMatch(couponModel, { code: value.code.toUpperCase(), isActive: true, isDeleted: false }, {}, {});
        if (!coupon) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('Coupon'), {}, {}));
        if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) return res.status(HTTP_STATUS.GONE).json(new apiResponse(HTTP_STATUS.GONE, 'Coupon has expired', {}, {}));
        if (value.orderAmount < coupon.minOrderAmount) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, `Minimum order amount is ₹${coupon.minOrderAmount}`, {}, {}));

        let discount = 0;
        if (coupon.type === 'percentOff') {
            discount = (value.orderAmount * coupon.discountPercent) / 100;
            if (coupon.maxDiscountCap) discount = Math.min(discount, coupon.maxDiscountCap);
        } else if (coupon.type === 'flatOff') {
            discount = coupon.discountAmount;
        } else if (coupon.type === 'prepaidDiscount' && value.isPrepaid) {
            discount = (value.orderAmount * coupon.discountPercent) / 100;
            if (coupon.maxDiscountCap) discount = Math.min(discount, coupon.maxDiscountCap);
        }

        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, 'Coupon applied successfully', {
            code: coupon.code,
            discount,
            finalAmount: value.orderAmount - discount,
        }, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};
