import Joi from 'joi';
import { USER_ROLES, isValidObjectId } from '../common';
import { getPaginationAndFilterSchema } from './common';

export const addUserSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(...Object.values(USER_ROLES)).default('USER'),
    contact: Joi.object({
        countryCode: Joi.string().default('+91'),
        phoneNo: Joi.string().required()
    }).required(),
    isActive: Joi.boolean().optional()
});

export const editUserSchema = Joi.object({
    userId: Joi.string().custom(isValidObjectId).required(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(6),
    role: Joi.string().valid(...Object.values(USER_ROLES)),
    contact: Joi.object({
        countryCode: Joi.string(),
        phoneNo: Joi.string()
    }),
    isActive: Joi.boolean()
});

export const deleteUserSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required()
});

export const getUsersSchema = getPaginationAndFilterSchema;

export const getUserByIdSchema = Joi.object({
    id: Joi.string().custom(isValidObjectId).required()
});

