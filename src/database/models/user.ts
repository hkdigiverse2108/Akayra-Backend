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
    otp: { type: Number, default: null },
    otpExpireTime: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true })

export const userModel = mongoose.model('user', userSchema);