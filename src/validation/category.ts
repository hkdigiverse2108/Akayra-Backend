import Joi from "joi";
import { getPaginationAndFilterSchema } from "./common";

export const addCategorySchema = Joi.object({
    name: Joi.string().required(),
    image: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
})

export const editCategorySchema = Joi.object({
    categoryId: Joi.string().required(),
    name: Joi.string().optional(),
    image: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
})

export const deleteCategorySchema = Joi.object({
    id: Joi.string().required(),
})

export const getCategoriesSchema = getPaginationAndFilterSchema;

export const getCategoryByIdSchema = Joi.object({
    id: Joi.string().required(),
})