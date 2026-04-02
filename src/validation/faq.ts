import Joi from "joi";
import { getPaginationAndFilterSchema } from "./common";

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

export const getFaqsSchema = getPaginationAndFilterSchema.keys({
    faqCategoryId: Joi.string().optional(),
});

