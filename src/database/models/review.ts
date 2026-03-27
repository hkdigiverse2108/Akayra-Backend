import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    name: { type: String },
    image: { type: String },
    personName: { type: String },
    email: { type: String },
    description: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    date: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export const reviewModel = mongoose.model('review', reviewSchema);
