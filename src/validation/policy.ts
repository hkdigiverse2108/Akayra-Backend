import Joi from "joi";
import { POLICY_TYPE } from "../common";

export const addPolicySchema = Joi.object({
    type: Joi.string().valid(...Object.values(POLICY_TYPE)).required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    isActive: Joi.boolean().optional(),
})

export const editPolicySchema = Joi.object({
    type: Joi.string().valid(...Object.values(POLICY_TYPE)).required(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
})

export const getPolicyByTypeSchema = Joi.object({
    type: Joi.string().valid(...Object.values(POLICY_TYPE)).required(),
})

