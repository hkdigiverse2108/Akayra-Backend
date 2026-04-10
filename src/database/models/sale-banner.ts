import mongoose from 'mongoose';

const saleBannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { type: String, required: true },
    saleEndTime: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const saleBannerModel = mongoose.model('sale-banner', saleBannerSchema);
