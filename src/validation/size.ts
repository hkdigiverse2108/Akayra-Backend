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
