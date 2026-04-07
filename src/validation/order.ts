import Joi, { object } from "joi";
import { ORDER_STATUS, PAYMENT_STATUS } from "../common";
import { objectId } from "./common";

const shippingAddressSchema = Joi.object({
  country: Joi.string().required(),
  address1: Joi.string().required(),
  address2: Joi.string().allow("").optional(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pinCode: Joi.string().required(),
  default: Joi.boolean().optional(),
});

const orderItemSchema = Joi.object({
  productId: objectId().required(),
  quantity: Joi.number().min(1).required(),
  colorId: objectId().optional(),
  sizeId: objectId().optional(),
  price: Joi.number().required(),
});

export const addOrderSchema = Joi.object({
  userId: objectId().optional(),
  addressId: objectId().optional(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().optional(),
  phone: Joi.object({
    countryCode: Joi.string().optional(),
    number: Joi.string().optional(),
  }).optional(),
  shippingAddress: shippingAddressSchema.optional(),
  items: Joi.array().items(orderItemSchema).min(1).required(),
  discountCode: Joi.string().optional(),
  subtotal: Joi.number().required(),
  total: Joi.number().required(),
  currency: Joi.string().optional(),
  razorpayId: Joi.string().allow(null, "").optional(),
  phonePeId: Joi.string().allow(null, "").optional(),
  paymentStatus: Joi.string()
    .valid(...Object.values(PAYMENT_STATUS))
    .default(PAYMENT_STATUS.PENDING)
    .required(),
  orderStatus: Joi.string()
    .valid(...Object.values(ORDER_STATUS))
    .default(ORDER_STATUS.PENDING)
    .required(),
});

export const getOrdersSchema = Joi.object({
  page: Joi.number().optional(),
  limit: Joi.number().optional(),
  search: Joi.string().optional(),
  startDateFilter: Joi.string().optional(),
  endDateFilter: Joi.string().optional(),
  activeFilter: Joi.boolean().optional(),
  sortFilter: Joi.string().allow("", null).optional(),
  orderStatusFilter: Joi.string()
    .valid(...Object.values(ORDER_STATUS))
    .optional(),
  paymentStatusFilter: Joi.string()
    .valid(...Object.values(PAYMENT_STATUS))
    .optional(),
});

export const getOrderByIdSchema = Joi.object({
  id: objectId().required(),
});