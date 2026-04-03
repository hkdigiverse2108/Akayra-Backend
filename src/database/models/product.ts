import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    images: [{ type: String }],
    thumbnail: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
    title: { type: String, required: true },
    rating: { type: Number, default: 0 },
    mrp: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    cogsPrice: { type: Number },
    netProfit: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    shortDescription: { type: String },
    longDescription: { type: String },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'brand' },
    sku: { type: String },
    isTrending: { type: Boolean, default: false },
    isDealOfDay: { type: Boolean, default: false },
    isOurTrendingProduct: { type: Boolean, default: false },
    sizeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'size' }],
    colorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'color' }],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

export const productModel = mongoose.model('product', productSchema);
