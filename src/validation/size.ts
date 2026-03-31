import Joi from "joi";

export const addSizeSchema = Joi.object({
    name: Joi.string().required(),
    isActive: Joi.boolean().optional(),
})
export const editSizeSchema = Joi.object({
    sizeId: Joi.string().required(),
    name: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
})
export const deleteSizeSchema = Joi.object({ id: Joi.string().required() })
export const getSizeByIdSchema = Joi.object({ id: Joi.string().required() })

export const getSizesSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    search: Joi.string().allow('', null).optional(),
    activeFilter: Joi.boolean().optional(),
    sortFilter: Joi.string().allow('', null).optional(),
    startDateFilter: Joi.string().optional(),
    endDateFilter: Joi.string().optional(),
})
