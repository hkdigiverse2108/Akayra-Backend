import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
    name: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export const brandModel = mongoose.model('brand', brandSchema);
