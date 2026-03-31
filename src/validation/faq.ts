import Joi from "joi";

export const addFaqSchema = Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().required(),
    priority: Joi.number().optional(),
    faqCategoryId: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
})
export const editFaqSchema = Joi.object({
    faqId: Joi.string().required(),
    question: Joi.string().optional(),
    answer: Joi.string().optional(),
    priority: Joi.number().optional(),
    faqCategoryId: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
})

export const deleteFaqSchema = Joi.object({ id: Joi.string().required() })
export const getFaqByIdSchema = Joi.object({ id: Joi.string().required() })
export const getFaqsSchema = Joi.object({
    faqCategoryId: Joi.string().optional(),
    search: Joi.string().allow('', null).optional(),
    activeFilter: Joi.boolean().optional(),
    sortFilter: Joi.string().allow('', null).optional(),
    startDateFilter: Joi.string().optional(),
    endDateFilter: Joi.string().optional(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
})
