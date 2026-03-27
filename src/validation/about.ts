import Joi from "joi";

export const addAboutSectionSchema = Joi.object({
    title: Joi.string().optional(),
    subtitle: Joi.string().optional(),
    description: Joi.string().optional(),
    image: Joi.string().optional(),
    priority: Joi.number().optional(),
    isActive: Joi.boolean().optional(),
})
export const editAboutSectionSchema = Joi.object({
    sectionId: Joi.string().required(),
    title: Joi.string().optional(),
    subtitle: Joi.string().optional(),
    description: Joi.string().optional(),
    image: Joi.string().optional(),
    priority: Joi.number().optional(),
    isActive: Joi.boolean().optional(),
})
export const deleteAboutSectionSchema = Joi.object({ id: Joi.string().required() })
export const getAboutSectionByIdSchema = Joi.object({ id: Joi.string().required() })

export const getAllAboutSectionsSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    activeFilter: Joi.boolean().optional(),
})
