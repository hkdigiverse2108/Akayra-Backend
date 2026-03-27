import mongoose from 'mongoose';

const igPostSchema = new mongoose.Schema({
    title: { type: String },
    image: { type: String, required: true },
    link: { type: String },
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const igPostModel = mongoose.model('ig_post', igPostSchema);
