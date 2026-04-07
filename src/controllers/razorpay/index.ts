import crypto from "crypto";
import Razorpay from "razorpay";
import { apiResponse, HTTP_STATUS, PAYMENT_STATUS } from "../../common";
import { orderModel, settingsModel } from "../../database";
import { getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { createRazorpayPaymentSchema, razorpayPaymentVerifySchema } from "../../validation";

export const createRazorpayOrder = async ({ amount, currency, receipt }) => {
  const amountInPaise = Math.round((amount + Number.EPSILON) * 100);
  const normalized = amountInPaise / 100;
  const options = {
    amount: normalized,
    currency,
    receipt,
  };

  let setting = await getFirstMatch(settingsModel, {}, {}, {});

  const razorpay = new Razorpay({
    key_id: setting.razorpayApiKey,
    key_secret: setting.razorpayApiSecret,
  });
  const order = await razorpay.orders.create(options);
  return order;
};

export const create_razorpay_payment = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = createRazorpayPaymentSchema.validate(req.body || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const order = await createRazorpayOrder(value);

    return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, "Razorpay order created", order, {}));
  } catch (error: any) {
    const errorPayload = error?.response?.data || error;
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, errorPayload));
  }
};

const normalize = (v?: unknown) => (v == null ? undefined : String(v).trim() || undefined);

const getConfig = (o?: any) => {
  const keyId = normalize(o?.keyId);
  const keySecret = normalize(o?.keySecret);
  if (!keyId || !keySecret) throw new Error("Missing Razorpay credentials");
  return { keyId, keySecret };
};

const verifySignature = (orderId: string, paymentId: string, signature: string, o?: any) => {
  const { keySecret } = getConfig(o);
  const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");

  return expected === signature;
};

export const razorpay_verify_payment = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = razorpayPaymentVerifySchema.validate(req.body || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const orderId = value.razorpay_order_id || value.razorpayOrderId;
    const paymentId = value.razorpay_payment_id || value.razorpayPaymentId;
    const signature = value.razorpay_signature || value.razorpaySignature;

    if (!orderId || !paymentId || !signature) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.customMessage("Payment verification data missing"), {}, {}));

    let setting = await getFirstMatch(settingsModel, {}, {}, {});
    const config = { keyId: setting.razorpayApiKey, keySecret: setting.razorpayApiSecret };

    if (!verifySignature(orderId, paymentId, signature, config)) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.customMessage("Invalid Razorpay signature"), { verified: false }, {}));

    let criteria: any = { razorpayId: orderId, isDeleted: false };
    if (value.orderId) {
      const order = await getFirstMatch(orderModel, { _id: value.orderId, isDeleted: false }, {}, {});
      if (!order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));
      criteria = { _id: order._id, isDeleted: false };
    }

    const updated = await updateData(orderModel, criteria, { paymentStatus: PAYMENT_STATUS.PAID, ...(value.orderId && { razorpayId: orderId }) }, {});
    if (!updated) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));

    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.customMessage("Payment verified"), { verified: true, order: updated }, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};
