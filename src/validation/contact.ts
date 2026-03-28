import Joi from "joi";

export const addContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobileNumber: Joi.string().required(),
    subject: Joi.string().optional(),
    message: Joi.string().required(),
})

export const getContactsSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    search: Joi.string().optional(),
    isRead: Joi.boolean().optional(),
    startDateFilter: Joi.string().optional(),
    endDateFilter: Joi.string().optional(),
})

export const deleteContactSchema = Joi.object({ id: Joi.string().required() })
export const markReadContactSchema = Joi.object({ contactId: Joi.string().required() })
