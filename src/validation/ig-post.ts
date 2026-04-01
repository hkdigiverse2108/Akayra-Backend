import Joi from "joi";
import { IG_POST_TYPE } from "../common/enum";

export const addIgPostSchema = Joi.object({
    title: Joi.string().optional(),
    type: Joi.string().valid(...Object.values(IG_POST_TYPE)).required(),
    image: Joi.string().when('type', { is: IG_POST_TYPE.IMAGE, then: Joi.required(), otherwise: Joi.optional() }),
    video: Joi.string().when('type', { is: IG_POST_TYPE.VIDEO, then: Joi.required(), otherwise: Joi.optional() }),
    link: Joi.string().optional(),
    priority: Joi.number().optional(),
    isActive: Joi.boolean().optional(),
})
export const editIgPostSchema = Joi.object({
    igPostId: Joi.string().required(),
    title: Joi.string().optional(),
    type: Joi.string().valid(...Object.values(IG_POST_TYPE)).optional(),
    image: Joi.string().when('type', { is: IG_POST_TYPE.IMAGE, then: Joi.required(), otherwise: Joi.optional() }),
    video: Joi.string().when('type', { is: IG_POST_TYPE.VIDEO, then: Joi.required(), otherwise: Joi.optional() }),
    link: Joi.string().optional(),
    priority: Joi.number().optional(),
    isActive: Joi.boolean().optional(),
})
export const deleteIgPostSchema = Joi.object({ id: Joi.string().required() })
export const getIgPostByIdSchema = Joi.object({ id: Joi.string().required() })
export const getIgPostsSchema = Joi.object({
    activeFilter: Joi.boolean().optional(),
    startDateFilter: Joi.string().optional(),
    endDateFilter: Joi.string().optional(),
    page: Joi.number().optional(),
    limit: Joi.number().optional(),
})
