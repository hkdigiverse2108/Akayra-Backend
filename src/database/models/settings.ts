import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
    address: { type: String },
    contact: { type: String },
    email: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    youtube: { type: String },
    twitter: { type: String },
    isOutOfStockProductShow: { type: Boolean, default: true },
    freeDeliveryAbove: { type: Number, default: 0 },
    isCODAvailable: { type: Boolean, default: true },
    isRazorpay: { type: Boolean, default: false },
    isPhonePe: { type: Boolean, default: false },
    isShipRocket: { type: Boolean, default: false },
    isCashFree: { type: Boolean, default: false },
    razorpayApiKey: { type: String },
    razorpayApiSecret: { type: String },
    phonePeApiKey: { type: String },
    phonePeApiSecret: { type: String },
    phonePeApiVersion: { type: String },
    securePaymentImages: [{ type: String }],
    securePaymentTitle: { type: String },
}, { timestamps: true, versionKey: false });

export const settingsModel = mongoose.model('settings', settingsSchema);
