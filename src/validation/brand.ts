import Joi from "joi";
import { SORT_BY_NAME } from "../common";

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

export const getBrandsSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    search: Joi.string().optional(),
    sortFilter: Joi.string().valid(...Object.values(SORT_BY_NAME)).optional(),
    activeFilter: Joi.boolean().optional(),
    startDateFilter: Joi.string().optional(),
    endDateFilter: Joi.string().optional(),
})

export const getBrandByIdSchema = Joi.object({
    id: Joi.string().required(),
})

