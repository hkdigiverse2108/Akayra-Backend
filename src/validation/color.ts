import Joi from "joi";

export const addColorSchema = Joi.object({
    name: Joi.string().required(),
    hexCode: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
})
export const editColorSchema = Joi.object({
    colorId: Joi.string().required(),
    name: Joi.string().optional(),
    hexCode: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
})
export const deleteColorSchema = Joi.object({ id: Joi.string().required() })
export const getColorByIdSchema = Joi.object({ id: Joi.string().required() })
