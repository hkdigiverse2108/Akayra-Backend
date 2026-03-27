import Joi from "joi";

export const addWishlistSchema = Joi.object({
    productId: Joi.string().required(),
})

export const removeWishlistSchema = Joi.object({
    id: Joi.string().required(),
})

export const getWishlistSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
})
