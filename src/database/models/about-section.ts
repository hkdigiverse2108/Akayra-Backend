import mongoose from 'mongoose';

const aboutSectionSchema = new mongoose.Schema({
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    image: { type: String },
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true ,versionKey: false});

export const aboutSectionModel = mongoose.model('about_section', aboutSectionSchema);
