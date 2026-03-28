import Joi from "joi";

export const addFaqCategorySchema = Joi.object({
    title: Joi.string().required(),
    isActive: Joi.boolean().optional(),
})
export const editFaqCategorySchema = Joi.object({
    faqCategoryId: Joi.string().required(),
    title: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
})
export const deleteFaqCategorySchema = Joi.object({ id: Joi.string().required() })
export const getFaqCategoryByIdSchema = Joi.object({ id: Joi.string().required() })
export const getFaqCategoriesSchema = Joi.object({
    activeFilter: Joi.boolean().optional(),
    startDateFilter: Joi.string().optional(),
    endDateFilter: Joi.string().optional(),
    search: Joi.string().optional(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
})
