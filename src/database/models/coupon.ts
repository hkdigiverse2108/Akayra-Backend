import mongoose from 'mongoose';
import { COUPON_TYPE } from '../../common';

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    type: { type: String, enum: Object.values(COUPON_TYPE), required: true },
    discountPercent: { type: Number },
    discountAmount: { type: Number },
    buyQty: { type: Number },
    getFreeQty: { type: Number },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscountCap: { type: Number },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const couponModel = mongoose.model('coupon', couponSchema);
