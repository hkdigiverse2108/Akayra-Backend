import Joi from "joi";
import { getPaginationAndFilterSchema } from "./common";

export const subscribeNewsletterSchema = Joi.object({
    email: Joi.string().email().required(),
})

export const deleteNewsletterSchema = Joi.object({ id: Joi.string().required() })

export const getNewsletterSchema = getPaginationAndFilterSchema;

