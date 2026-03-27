import Joi from "joi";
import { COUPON_TYPE } from "../common";

export const addCouponSchema = Joi.object({
    code: Joi.string().required(),
    type: Joi.string().valid(...Object.values(COUPON_TYPE)).required(),
    discountPercent: Joi.number().optional(),
    discountAmount: Joi.number().optional(),
    buyQty: Joi.number().optional(),
    getFreeQty: Joi.number().optional(),
    minOrderAmount: Joi.number().optional(),
    maxDiscountCap: Joi.number().optional(),
    productIds: Joi.array().items(Joi.string()).optional(),
    expiryDate: Joi.date().optional(),
    isActive: Joi.boolean().optional(),
})

export const editCouponSchema = Joi.object({
    couponId: Joi.string().required(),
    code: Joi.string().optional(),
    type: Joi.string().valid(...Object.values(COUPON_TYPE)).optional(),
    discountPercent: Joi.number().optional(),
    discountAmount: Joi.number().optional(),
    buyQty: Joi.number().optional(),
    getFreeQty: Joi.number().optional(),
    minOrderAmount: Joi.number().optional(),
    maxDiscountCap: Joi.number().optional(),
    productIds: Joi.array().items(Joi.string()).optional(),
    expiryDate: Joi.date().optional(),
    isActive: Joi.boolean().optional(),
})

export const deleteCouponSchema = Joi.object({ id: Joi.string().required() })
export const getCouponByIdSchema = Joi.object({ id: Joi.string().required() })
export const getCouponsSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    search: Joi.string().optional(),
    activeFilter: Joi.boolean().optional(),
})
export const applyCouponSchema = Joi.object({
    code: Joi.string().required(),
    orderAmount: Joi.number().required(),
    productIds: Joi.array().items(Joi.string()).optional(),
    isPrepaid: Joi.boolean().optional(),
})

