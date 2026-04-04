import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product', required: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const wishlistModel = mongoose.model('wishlist', wishlistSchema);
