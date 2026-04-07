import mongoose from "mongoose";
import { randomUUID } from "crypto";
import { ORDER_STATUS, PAYMENT_STATUS } from "../../common";

const generateOrderId = () => randomUUID().replace(/-/g, "").slice(0, 5).toUpperCase();

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, sparse: true, index: true, minlength: 5, maxlength: 5, default: generateOrderId },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    addressId: { type: mongoose.Schema.Types.ObjectId, ref: "address", default: null },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, lowercase: true, trim: true },
    phone: {
      countryCode: { type: String },
      number: { type: String },
    },
    shippingAddress: {
      country: { type: String },
      address1: { type: String },
      address2: { type: String, default: "" },
      city: { type: String },
      state: { type: String },
      pinCode: { type: String },
      default: { type: Boolean, default: false },
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        quantity: { type: Number },
        colorId: { type: mongoose.Schema.Types.ObjectId, ref: "color" },
        sizeId: { type: mongoose.Schema.Types.ObjectId, ref: "size" },
        price: { type: Number },
      },
      { _id: false },
    ],
    discountCode: { type: String },
    subtotal: { type: Number },
    total: { type: Number },
    currency: { type: String, default: "INR" },
    razorpayId: { type: String, default: null },
    phonePeId: { type: String, default: null },
    merchantId: { type: String, default: null },
    paymentStatus: { type: String, default: PAYMENT_STATUS.PENDING },
    orderStatus: { type: String, default: ORDER_STATUS.PENDING },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

export const orderModel = mongoose.model("order", orderSchema, "order");
