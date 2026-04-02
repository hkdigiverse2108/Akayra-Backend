import Joi from "joi";
import { getPaginationAndFilterSchema } from "./common";

export const addProductSchema = Joi.object({
    title: Joi.string().required(),
    thumbnail: Joi.string().optional(),
    images: Joi.array().items(Joi.string()).optional(),
    categoryId: Joi.string().required(),
    brandId: Joi.string().optional(),
    sku: Joi.string().optional(),
    mrp: Joi.number().required(),
    sellingPrice: Joi.number().required(),
    cogsPrice: Joi.number().optional(),
    shortDescription: Joi.string().optional(),
    longDescription: Joi.string().optional(),
    additionalInformation: Joi.string().optional(),
    sizeIds: Joi.array().items(Joi.string()).optional(),
    colorIds: Joi.array().items(Joi.string()).optional(),
    isTrending: Joi.boolean().optional(),
    isDealOfDay: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
})

export const editProductSchema = Joi.object({
    productId: Joi.string().required(),
    title: Joi.string().optional(),
    thumbnail: Joi.string().optional(),
    images: Joi.array().items(Joi.string()).optional(),
    categoryId: Joi.string().optional(),
    brandId: Joi.string().optional(),
    sku: Joi.string().optional(),
    mrp: Joi.number().optional(),
    sellingPrice: Joi.number().optional(),
    cogsPrice: Joi.number().optional(),
    shortDescription: Joi.string().optional(),
    longDescription: Joi.string().optional(),
    additionalInformation: Joi.string().optional(),
    sizeIds: Joi.array().items(Joi.string()).optional(),
    colorIds: Joi.array().items(Joi.string()).optional(),
    isTrending: Joi.boolean().optional(),
    isDealOfDay: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
})

export const deleteProductSchema = Joi.object({
    id: Joi.string().required(),
})

export const getProductsSchema = getPaginationAndFilterSchema.keys({
    categoryId: Joi.string().optional(),
    brandId: Joi.string().optional(),
    isTrending: Joi.boolean().optional(),
    isDealOfDay: Joi.boolean().optional(),
})

export const getProductByIdSchema = Joi.object({
    id: Joi.string().required(),
})

