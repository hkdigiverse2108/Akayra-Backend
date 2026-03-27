import mongoose from 'mongoose';

const faqCategorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const faqCategoryModel = mongoose.model('faq_category', faqCategorySchema);

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    priority: { type: Number, default: 0 },
    faqCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'faq_category' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const faqModel = mongoose.model('faq', faqSchema);
