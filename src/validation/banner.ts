import Joi from "joi";
import { BANNER_TYPE } from "../common";
import { getPaginationAndFilterSchema } from "./common";

export const addBannerSchema = Joi.object({
    type: Joi.string().valid(...Object.values(BANNER_TYPE)).required(),
    title: Joi.string().required(),
    subtitle: Joi.string().optional(),
    ctaButton: Joi.string().optional(),
    ctaButtonRedirection: Joi.string().optional(),
    pageRedirection: Joi.string().optional(),
    endDate: Joi.date().optional(),
    image: Joi.string().optional(),
    priority: Joi.number().optional(),
    isActive: Joi.boolean().optional(),
})

export const editBannerSchema = Joi.object({
    bannerId: Joi.string().required(),
    type: Joi.string().valid(...Object.values(BANNER_TYPE)).optional(),
    title: Joi.string().optional(),
    subtitle: Joi.string().optional(),
    ctaButton: Joi.string().optional(),
    ctaButtonRedirection: Joi.string().optional(),
    pageRedirection: Joi.string().optional(),
    endDate: Joi.date().optional(),
    image: Joi.string().optional(),
    priority: Joi.number().optional(),
    isActive: Joi.boolean().optional(),
})

export const deleteBannerSchema = Joi.object({ id: Joi.string().required() })
export const getBannerByIdSchema = Joi.object({ id: Joi.string().required() })

export const getBannersSchema = getPaginationAndFilterSchema.keys({
    type: Joi.string().valid(...Object.values(BANNER_TYPE)).optional(),
});

