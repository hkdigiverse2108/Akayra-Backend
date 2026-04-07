import mongoose from 'mongoose'

const logsSchema = new mongoose.Schema({
    req: { type: Object },
    res: { type: Object },
    requestUrl: { type: String },
    reqPath: { type: String },
}, { timestamps: true })

export const logsModel = mongoose.model('logs', logsSchema);