import Joi from "joi";
import { POLICY_TYPE } from "../common";

export const addEditPolicySchema = Joi.object({
    type: Joi.string().valid(...Object.values(POLICY_TYPE)).required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    isActive: Joi.boolean().optional(),
})

export const getPolicyByTypeSchema = Joi.object({
    typeFilter: Joi.string().valid(...Object.values(POLICY_TYPE)).required(),
})

