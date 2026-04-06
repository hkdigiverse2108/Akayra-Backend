import Joi from "joi";
import { getPaginationAndFilterSchema } from "./common";

export const addReviewSchema = Joi.object({
  productId: Joi.string().required(),
  name: Joi.string().optional(),
  personName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  image: Joi.string().optional(),
  description: Joi.string().optional(),
  rating: Joi.number().min(1).max(5).required(),
  date: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
});

export const editReviewSchema = Joi.object({
  productId: Joi.string().optional(),
  reviewId: Joi.string().required(),
  name: Joi.string().optional(),
  personName: Joi.string().optional(),
  email: Joi.string().email().optional(),
  image: Joi.string().optional(),
  description: Joi.string().optional(),
  rating: Joi.number().min(1).max(5).optional(),
  date: Joi.date().optional(),
  isActive: Joi.boolean().optional(),
});

export const deleteReviewSchema = Joi.object({
  id: Joi.string().required(),
});

export const getReviewsSchema = getPaginationAndFilterSchema.keys({
  productId: Joi.string().optional(),
});

export const getReviewByIdSchema = Joi.object({
  id: Joi.string().required(),
});
