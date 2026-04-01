import mongoose from 'mongoose';
import { IG_POST_TYPE } from '../../common/enum';

const igPostSchema = new mongoose.Schema({
    title: { type: String },
    type: { type: String, enum: Object.values(IG_POST_TYPE), required: true },
    image: { type: String },
    video: { type: String },
    link: { type: String },
    priority: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

export const igPostModel = mongoose.model('ig_post', igPostSchema);
