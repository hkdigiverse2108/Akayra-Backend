import mongoose from 'mongoose';
import { BANNER_TYPE } from '../../common';

// Hero Banner
const bannerSchema = new mongoose.Schema({
    type: { type: String, enum: Object.values(BANNER_TYPE), required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    ctaButton: { type: String },
    ctaButtonRedirection: { type: String },
    pageRedirection: { type: String },
    endDate: { type: Date },
    image: { type: String },
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const bannerModel = mongoose.model('banner', bannerSchema);
