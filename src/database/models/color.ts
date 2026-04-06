import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g. "Red", "Blue"
    hexCode: { type: String },                            // e.g. "#FF0000"
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const colorModel = mongoose.model('color', colorSchema);
