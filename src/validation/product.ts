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
    sizeIds: Joi.array().items(Joi.string()).optional(),
    colorIds: Joi.array().items(Joi.string()).optional(),
    isTrending: Joi.boolean().optional(),
    isDealOfDay: Joi.boolean().optional(),
    isSale: Joi.boolean().optional(),
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
    sizeIds: Joi.array().items(Joi.string()).optional(),
    colorIds: Joi.array().items(Joi.string()).optional(),
    isTrending: Joi.boolean().optional(),
    isDealOfDay: Joi.boolean().optional(),
    isSale: Joi.boolean().optional(),
    isActive: Joi.boolean().optional(),
})

export const deleteProductSchema = Joi.object({
    id: Joi.string().required(),
})

export const getProductsSchema = getPaginationAndFilterSchema.keys({
    categoryId: Joi.string().optional(),
    brandId: Joi.string().optional(),
    sizeIds: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
    colorIds: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
    "sizeIds[]": Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
    "colorIds[]": Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()).optional(),
    minPrice: Joi.number().optional(),
    maxPrice: Joi.number().optional(),
    inStockOnly: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    inStock: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    isTrending: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    isDealOfDay: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
    isSale: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
})

export const getProductByIdSchema = Joi.object({
    id: Joi.string().required(),
})

