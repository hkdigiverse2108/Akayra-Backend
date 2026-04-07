import Joi from "joi";

export const createRazorpayPaymentSchema = Joi.object({
  orderId: Joi.string().optional(),
  amount: Joi.when("orderId", {
    is: Joi.string().trim().min(1),
    then: Joi.number().optional(),
    otherwise: Joi.number().required(),
  }),
  currency: Joi.string().optional(),
  receipt: Joi.string().optional(),
});

export const razorpayPaymentVerifySchema = Joi.object({
  razorpay_order_id: Joi.string().optional(),
  razorpayOrderId: Joi.string().optional(),
  razorpay_payment_id: Joi.string().optional(),
  razorpayPaymentId: Joi.string().optional(),
  razorpay_signature: Joi.string().optional(),
  razorpaySignature: Joi.string().optional(),
  orderId: Joi.string().optional(),
});
