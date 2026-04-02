import Joi from "joi";
import { getPaginationAndFilterSchema } from "./common";

export const addWishlistSchema = Joi.object({
    productId: Joi.string().required(),
})

export const removeWishlistSchema = Joi.object({
    id: Joi.string().required(),
})

export const getWishlistSchema = getPaginationAndFilterSchema;

