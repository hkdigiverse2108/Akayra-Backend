import mongoose from 'mongoose';
import { CART_STATUS } from '../../common';

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    quantity: { type: Number, default: 1 },
    size: { type: String },
    color: { type: String },
}, { _id: false });

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    sessionId: { type: String },
    items: [cartItemSchema],
    note: { type: String },
    status: { type: String, enum: Object.values(CART_STATUS), default: CART_STATUS.PENDING },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const cartModel = mongoose.model('cart', cartSchema);
