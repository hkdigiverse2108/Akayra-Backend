import { USER_ROLES } from "../../common";

const mongoose = require('mongoose')

const userSchema: any = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    contact: {
        countryCode: { type: String },
        phoneNo: { type: String },
    },
    password: { type: String },
    profilePhoto: { type: String },
    role: { type: String, enum: Object.values(USER_ROLES), default: USER_ROLES.USER },
    otp: { type: Number, default: null },
    otpExpireTime: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false })

export const userModel = mongoose.model('user', userSchema);