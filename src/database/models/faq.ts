import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true },
    priority: { type: Number, default: 0 },
    faqCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'faq-category' },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const faqModel = mongoose.model('faq', faqSchema);
