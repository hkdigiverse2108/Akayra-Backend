import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    titleTag: { type: String },
    metaDescription: { type: String },
    urlSlug: { type: String, unique: true },
    imageAltText: { type: String },
    thumbnail: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    tagLine: { type: String },
    tags: [{ type: String }],
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'category' }],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false });

export const blogModel = mongoose.model('blog', blogSchema);
