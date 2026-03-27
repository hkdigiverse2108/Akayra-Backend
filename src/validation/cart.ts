import Joi from "joi";

export const addToCartSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().min(1).optional(),
    size: Joi.string().optional(),
    color: Joi.string().optional(),
    sessionId: Joi.string().optional(), // for guest carts
    note: Joi.string().optional(),
})

export const updateCartItemSchema = Joi.object({
    cartId: Joi.string().required(),
    productId: Joi.string().required(),
    quantity: Joi.number().min(0).required(), // 0 = remove
    size: Joi.string().optional(),
    color: Joi.string().optional(),
})

export const clearCartSchema = Joi.object({
    cartId: Joi.string().required(),
})

export const getCartSchema = Joi.object({
    sessionId: Joi.string().optional(),
})
