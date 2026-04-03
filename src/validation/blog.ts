import Joi from "joi";
import { getPaginationAndFilterSchema } from "./common";

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
    titleTag: Joi.string().optional().allow("",null),
    metaDescription: Joi.string().optional().allow("",null),
    urlSlug: Joi.string().optional().allow("",null),
    imageAltText: Joi.string().optional().allow("",null),
    thumbnail: Joi.string().optional().allow("",null),
    title: Joi.string().optional(),
    description: Joi.string().optional().allow("",null),
    tagLine: Joi.string().optional().allow("",null),
    tags: Joi.array().items(Joi.string()).optional().allow("",null),
    categoryIds: Joi.array().items(Joi.string()).optional().allow("",null),
    isActive: Joi.boolean().optional(),
})

export const deleteBlogSchema = Joi.object({
    id: Joi.string().required()
})

export const getBlogByIdSchema = Joi.object({
    id: Joi.string().required()
})

export const getBlogsSchema = getPaginationAndFilterSchema;

