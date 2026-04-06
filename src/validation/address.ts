import Joi from "joi";
import { getPaginationAndFilterSchema } from "./common";

export const addAddressSchema = Joi.object({
  country: Joi.string().required(),
  address1: Joi.string().required(),
  address2: Joi.string().allow("").optional(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pinCode: Joi.string().required(),
  isDefault: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
});

export const editAddressSchema = Joi.object({
  addressId: Joi.string().required(),
  country: Joi.string().optional(),
  address1: Joi.string().optional(),
  address2: Joi.string().allow("").optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  pinCode: Joi.string().optional(),
  isDefault: Joi.boolean().optional(),
  isActive: Joi.boolean().optional(),
});

export const deleteAddressSchema = Joi.object({
  id: Joi.string().required(),
});

export const getAddressByIdSchema = Joi.object({
  id: Joi.string().required(),
});

export const getAllAddressSchema = getPaginationAndFilterSchema;
