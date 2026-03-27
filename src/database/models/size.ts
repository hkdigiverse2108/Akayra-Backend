import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g. "XS", "S", "M", "L", "XL", "XXL", "28", "30"
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const sizeModel = mongoose.model('size', sizeSchema);
