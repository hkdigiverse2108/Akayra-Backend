import Joi from "joi";

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

export const getCategoriesSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    search: Joi.string().optional(),
    activeFilter: Joi.boolean().optional(),
    sortFilter: Joi.string().allow('', null).optional(),
    startDateFilter: Joi.string().optional(),
    endDateFilter: Joi.string().optional(),
})


export const getCategoryByIdSchema = Joi.object({
    id: Joi.string().required(),
})