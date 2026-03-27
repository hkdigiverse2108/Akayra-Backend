import Joi from "joi";

export const addIgPostSchema = Joi.object({
    title: Joi.string().optional(),
    image: Joi.string().required(),
    link: Joi.string().optional(),
    priority: Joi.number().optional(),
    isActive: Joi.boolean().optional(),
})
export const editIgPostSchema = Joi.object({
    igPostId: Joi.string().required(),
    title: Joi.string().optional(),
    image: Joi.string().optional(),
    link: Joi.string().optional(),
    priority: Joi.number().optional(),
    isActive: Joi.boolean().optional(),
})
export const deleteIgPostSchema = Joi.object({ id: Joi.string().required() })
export const getIgPostByIdSchema = Joi.object({ id: Joi.string().required() })
