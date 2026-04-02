import Joi from "joi";
import { getPaginationAndFilterSchema } from "./common";

export const addBrandSchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
})

export const editBrandSchema = Joi.object({
    brandId: Joi.string().required(),
    name: Joi.string().optional(),
    image: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
})

export const deleteBrandSchema = Joi.object({
    id: Joi.string().required(),
})

export const getBrandsSchema = getPaginationAndFilterSchema;

export const getBrandByIdSchema = Joi.object({
    id: Joi.string().required(),
})


