import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { apiResponse, HTTP_STATUS, isValidObjectId, PAYMENT_STATUS } from "../../common";
import { logsModel, orderModel, settingsModel } from "../../database";
import { getFirstMatch, reqInfo, updateData } from "../../helper";

const isProd = process.env.NODE_ENV === "production";

const getPhonePeAccessToken = async () => {
  try {
    let settings = await getFirstMatch(settingsModel, {}, {}, {});

    const CLIENT_ID = settings?.phonePeApiKey;
    const CLIENT_SECRET = settings?.phonePeApiSecret;
    const CLIENT_VERSION = settings?.phonePeApiVersion;

    const authUrl = isProd ? "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token" : "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";

    // Prepare form data as URL-encoded
    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("client_version", CLIENT_VERSION);
    params.append("client_secret", CLIENT_SECRET);
    params.append("grant_type", "client_credentials");

    const response = await axios.post(authUrl, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
    });

    if (!response.data.access_token && !response.data.accessToken) {
      console.error("Access token not found in response:", response.data);
      throw new Error("Access token not received from PhonePe API");
    }

    return response.data.access_token || response.data.accessToken;
  } catch (error) {
    console.error("Error getting PhonePe access token:", error.response?.data || error.message);
    throw error;
  }
};

export const create_phonepe_payment = async (req, res) => {
  reqInfo(req);
  try {
    const { amount, redirectUrl, orderId } = req.body;

    let order = await getFirstMatch(orderModel, { _id: isValidObjectId(orderId) }, {}, {});

    if (!order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, "Order not found", {}, {}));

    if (!amount) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Amount is required", {}, {}));

    let uuid = uuidv4();
    const createPaymentUrl = isProd ? "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay" : "https://api.phonepe.com/apis/pg/checkout/v2/pay";
    const merchantRedirectUrl = redirectUrl;

    const accessToken = await getPhonePeAccessToken();

    const paymentPayload = {
      merchantOrderId: uuid,
      amount: amount * 100,
      expireAfter: 500,
      metaInfo: {
        udf1: uuid,
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Payment message used for collect requests",
        merchantUrls: {
          redirectUrl: merchantRedirectUrl,
        },
      },
    };

    // Step 3: Create Payment Request
    const response = await axios.post(createPaymentUrl, paymentPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${accessToken}`, // PhonePe uses O-Bearer format
        Accept: "application/json",
      },
    });

    const paymentUrl = response.data?.data?.instrumentResponse?.redirectInfo?.url || response.data?.data?.redirectUrl || response.data?.redirectUrl || response.data?.url;

    if (!paymentUrl) {
      throw new Error("Payment URL not found in response");
    }

    // Update order with payment details based on order type
    const phonePeOrderId = response.data?.orderId || response.data?.data?.orderId;

    await updateData(orderModel, { _id: isValidObjectId(orderId) }, { phonePeId: phonePeOrderId, merchantId: uuid }, {});

    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Payment order created successfully", { merchantOrderId: uuid, paymentUrl: paymentUrl, amount: amount }, {}));
  } catch (error) {
    console.error("PhonePe Payment Error:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to initiate payment", {}, error));
  }
};

export const phonepe_callback = async (req, res) => {
  reqInfo(req);
  console.log("req.body => ", req.body);
  try {
    await logsModel.create({
      req: req.body,
      res: { status: HTTP_STATUS.OK, message: "Callback processed successfully" },
      requestUrl: req?.originalUrl,
      reqPath: req?.url,
    });
    const { event, payload } = req.body;

    if (!payload) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid callback structure", {}, {}));

    const { merchantOrderId, state } = payload;

    if (!merchantOrderId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "merchantOrderId is required", {}, {}));

    if (!state) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "state is required", {}, {}));

    let order = await orderModel.findOne({ merchantId: merchantOrderId, status: { $ne: "COMPLETED" }, isDeleted: false });
    if (!order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, "Order not found for this merchantOrderId", {}, {}));

    const updateData: any = {
      status: state.toUpperCase(),
    };

    let updatedOrder;
    updateData.paymentStatus = state === "COMPLETED" ? PAYMENT_STATUS.PAID : PAYMENT_STATUS.FAILED;
    updatedOrder = await orderModel.findOneAndUpdate({ _id: order._id, isDeleted: false }, updateData, { new: true });

    if (!updatedOrder) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Failed to update order", {}, {}));
    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Callback processed successfully", {}, {}));
  } catch (error) {
    console.error("PhonePe Payment Callback Error:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Callback received but processing failed", { error: error.message }, {}));
  }
};
