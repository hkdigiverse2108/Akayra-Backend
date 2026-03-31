import Joi from "joi";

export const addBlogSchema = Joi.object({
    titleTag: Joi.string().optional(),
    metaDescription: Joi.string().optional(),
    urlSlug: Joi.string().required(),
    imageAltText: Joi.string().optional(),
    thumbnail: Joi.string().optional(),
    title: Joi.string().required(),
    description: Joi.string().optional(),
    tagLine: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    categoryIds: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
})

export const editBlogSchema = Joi.object({
    blogId: Joi.string().required(),
    titleTag: Joi.string().optional(),
    metaDescription: Joi.string().optional(),
    urlSlug: Joi.string().optional(),
    imageAltText: Joi.string().optional(),
    thumbnail: Joi.string().optional(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    tagLine: Joi.string().optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    categoryIds: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional(),
})

export const deleteBlogSchema = Joi.object({ id: Joi.string().required() })
export const getBlogByIdSchema = Joi.object({ id: Joi.string().required() })
export const getBlogsSchema = Joi.object({
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
    search: Joi.string().allow('', null).optional(),
    activeFilter: Joi.boolean().optional(),
    sortFilter: Joi.string().allow('', null).optional(),
    startDateFilter: Joi.string().optional(),
    endDateFilter: Joi.string().optional(),
})
