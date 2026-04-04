import Joi from "joi";
import { getPaginationAndFilterSchema } from "./common";

export const addContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string().required(),
  subject: Joi.string().optional(),
  message: Joi.string().required(),
});

export const getContactsSchema = getPaginationAndFilterSchema.keys({
  isRead: Joi.boolean().optional(),
});

export const deleteContactSchema = Joi.object({ id: Joi.string().required() });
export const markReadContactSchema = Joi.object({ contactId: Joi.string().required() });
