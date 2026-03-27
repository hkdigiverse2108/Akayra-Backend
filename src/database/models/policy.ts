import mongoose from 'mongoose';
import { POLICY_TYPE } from '../../common';

const policySchema = new mongoose.Schema({
    type: { type: String, enum: Object.values(POLICY_TYPE) },
    title: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const policyModel = mongoose.model('policy', policySchema);
