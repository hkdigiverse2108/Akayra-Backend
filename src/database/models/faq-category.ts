import mongoose from 'mongoose';

const faqCategorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const faqCategoryModel = mongoose.model('faq-category', faqCategorySchema);