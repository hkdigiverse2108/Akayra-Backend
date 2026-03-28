import Joi from "joi";

export const subscribeNewsletterSchema = Joi.object({
    email: Joi.string().email().required(),
})

export const deleteNewsletterSchema = Joi.object({ id: Joi.string().required() })

export const getNewsletterSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    search: Joi.string().optional(),
    startDateFilter: Joi.string().optional(),
    endDateFilter: Joi.string().optional(),
})
