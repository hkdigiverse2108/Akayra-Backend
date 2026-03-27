import Joi from "joi";

export const updateSettingsSchema = Joi.object({
    address: Joi.string().optional(),
    contact: Joi.string().optional(),
    email: Joi.string().email().optional(),
    instagram: Joi.string().optional(),
    facebook: Joi.string().optional(),
    youtube: Joi.string().optional(),
    twitter: Joi.string().optional(),
    isOutOfStockProductShow: Joi.boolean().optional(),
    freeDeliveryAbove: Joi.number().optional(),
    isCODAvailable: Joi.boolean().optional(),
    isRazorpay: Joi.boolean().optional(),
    isPhonePe: Joi.boolean().optional(),
    isShipRocket: Joi.boolean().optional(),
    isCashFree: Joi.boolean().optional(),
    securePaymentImages: Joi.array().items(Joi.string()).optional(),
    securePaymentTitle: Joi.string().optional(),
})
