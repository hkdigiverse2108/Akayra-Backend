import Joi from "joi";
import mongoose from "mongoose";

export const getPaginationAndFilterSchema = Joi.object({
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  search: Joi.string().allow("", null).optional(),
  activeFilter: Joi.boolean().optional(),
  sortFilter: Joi.string().allow("", null).optional(),
  startDateFilter: Joi.string().optional(),
  endDateFilter: Joi.string().optional(),
});

export const objectId = () =>
  Joi.string()
    .custom((value, helpers) => {
      if (!mongoose?.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "ObjectId Validation")
    .allow(null);
