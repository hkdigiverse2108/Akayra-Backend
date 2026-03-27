import Joi from "joi";

// FAQ Category
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


// FAQ
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
    activeFilter: Joi.boolean().optional(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
})
