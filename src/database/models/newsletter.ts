import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const newsletterModel = mongoose.model('newsletter', newsletterSchema);
