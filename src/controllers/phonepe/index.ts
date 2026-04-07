import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { apiResponse, HTTP_STATUS, isValidObjectId } from "../../common";
import { logsModel, orderModel, settingsModel } from "../../database";
import { getFirstMatch, reqInfo, updateData } from "../../helper";

// // utils
// const normalize = (v?: unknown) => (v == null ? undefined : String(v).trim() || undefined);

// const getPhonePeClientConfig = (o?: any) => {
//   const clientId = normalize(o?.clientId);
//   const clientSecret = normalize(o?.clientSecret);
//   const clientVersion = normalize(o?.clientVersion);

//   if (!clientId || !clientSecret || !clientVersion) {
//     throw new Error("Missing PhonePe credentials");
//   }
//   return { clientId, clientSecret, clientVersion };
// };

// const getPhonePeRedirectUrls = () => {
//   const base = process.env.BACKEND_URL?.replace(/\/$/, "") || "";
//   return {
//     redirectUrl: base && `${base}/phonepe/redirect`,
//     callbackUrl: base && `${base}/phonepe/callback`,
//   };
// };

// // const getPhonePeBaseUrl = "https://api-preprod.phonepe.com/apis/pg-sandbox";
// const getPhonePeBaseUrl = "https://api.phonepe.com/apis/pg";

// const getPhonePeAccessToken = async (o?: any) => {
//   const { clientId, clientSecret, clientVersion } = getPhonePeClientConfig(o);

//   const { data } = await axios.post(
//     `${getPhonePeBaseUrl}/v1/oauth/token`,
//     new URLSearchParams({
//       client_id: clientId,
//       client_secret: clientSecret,
//       client_version: clientVersion,
//       grant_type: "client_credentials",
//     }).toString(),
//     { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
//   );

//   return (
//     data?.access_token ||
//     data?.accessToken ||
//     data?.data?.access_token ||
//     data?.data?.accessToken ||
//     (() => {
//       throw new Error("Token missing");
//     })()
//   );
// };

// // main API
// export const create_phonepe_payment = async (req, res) => {
//   reqInfo(req);
//   try {
//     const { error, value } = createPhonePePaymentSchema.validate(req.body || {});
//     if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

//     const { amount, expireAfter = 1200, message = "Payment", metaInfo, redirectUrl, callbackUrl, orderId, merchantOrderId } = value;

//     // order fetch
//     const order = orderId ? await getFirstMatch(orderModel, { _id: orderId, isDeleted: false }, {}, {}) : null;

//     if (orderId && !order) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Order"), {}, {}));

//     // URLs
//     const urls = getPhonePeRedirectUrls();
//     const finalRedirectUrl = redirectUrl || urls.redirectUrl;
//     const finalCallbackUrl = callbackUrl || urls.callbackUrl;

//     if (!finalRedirectUrl) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Redirect URL required", {}, {}));

//     // amount
//     const finalAmount = Number(amount ?? order?.total);
//     if (!Number.isFinite(finalAmount)) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Invalid amount", {}, {}));
//     const amountInPaise = Math.round((finalAmount + Number.EPSILON) * 100);
//     const normalized = amountInPaise / 100;
//     const payload: any = {
//       merchantOrderId,
//       amount: normalized,
//       expireAfter,
//       paymentFlow: {
//         type: "PG_CHECKOUT",
//         message,
//         merchantUrls: {
//           redirectUrl: finalRedirectUrl,
//           ...(finalCallbackUrl && { callbackUrl: finalCallbackUrl }),
//         },
//       },
//       ...(metaInfo && { metaInfo }),
//     };

//     // config
//     const settings = await getFirstMatch(settingsModel, { isDeleted: false }, {}, {});
//     if (!settings) return {};

//     const token = await getPhonePeAccessToken({
//       clientId: settings.phonePeApiKey,
//       clientSecret: settings.phonePeApiSecret,
//       clientVersion: settings.phonePeVersion,
//     });

//     const { data } = await axios.post(`${getPhonePeBaseUrl}/checkout/v2/pay`, payload, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `O-Bearer ${token}`,
//       },
//     });

//     if (order) await updateData(orderModel, { _id: order._id }, { phonePeId: merchantOrderId }, {});
//     return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Payment initiated", { merchantOrderId, orderId: order?.orderId || null, phonepe: data }, {}));
//   } catch (err: any) {
//     return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, err?.response?.data || err));
//   }
// };

const getPhonePeAccessToken = async () => {
  try {
    let settings = await getFirstMatch(settingsModel, {}, {}, {});

    const CLIENT_ID = settings?.phonePeApiKey;
    const CLIENT_SECRET = settings?.phonePeApiSecret;
    const CLIENT_VERSION = settings?.phonePeApiVersion;

    // const authUrl = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
    const authUrl = "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";

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
    const createPaymentUrl = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";
    // const createPaymentUrl = "https://api.phonepe.com/apis/pg/checkout/v2/pay";
    const merchantRedirectUrl = redirectUrl || "https://www.bharatexamfest.com";

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
    console.log("response", response);

    const paymentUrl = response.data?.data?.instrumentResponse?.redirectInfo?.url || response.data?.data?.redirectUrl || response.data?.redirectUrl || response.data?.url;

    if (!paymentUrl) {
      throw new Error("Payment URL not found in response");
    }

    // Update order with payment details based on order type
    const phonePeOrderId = response.data?.orderId || response.data?.data?.orderId;
    console.log("phonePeOrderId", phonePeOrderId);

    await updateData(orderModel, { _id: isValidObjectId(orderId) }, { phonePeId: phonePeOrderId, merchantId: uuid }, {});

    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Payment order created successfully", { merchantOrderId: uuid, paymentUrl: paymentUrl, amount: amount }, {}));
  } catch (error) {
    console.error("PhonePe Payment Error:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Failed to initiate payment", {}, error));
  }
};

// export const phonepeCallback = async (req, res) => {
//   reqInfo(req);
//   console.log("req.body => ", req.body);
//   try {
//     await logsModel.create({
//       req: req.body,
//       res: { status: 200, message: "Callback processed successfully" },
//       requestUrl: req?.originalUrl,
//       reqPath: req?.url,
//     });
//     const { event, payload } = req.body;

//     if (!payload) {
//       return res.status(200).json(new apiResponse(400, "Invalid callback structure", {}, {}));
//     }

//     const { merchantOrderId, state } = payload;

//     if (!merchantOrderId) return res.status(200).json(new apiResponse(400, "merchantOrderId is required", {}, {}));

//     if (!state) return res.status(200).json(new apiResponse(400, "state is required", {}, {}));

//     let order = await workshopRegisterModel.findOne({ paymentId: merchantOrderId, status: { $ne: "COMPLETED" }, isDeleted: false });
//     let orderType = "workshop";

//     if (!order) {
//       order = await coursePurchaseModel.findOne({ paymentId: merchantOrderId, status: { $ne: "COMPLETED" }, isDeleted: false });
//       orderType = "course";
//     }
//     if (!order) {
//       order = await balanceModel.findOne({ utrId: merchantOrderId, isDeleted: false });
//       orderType = "balance";
//     }

//     if (!order) return res.status(200).json(new apiResponse(404, "Order not found for this merchantOrderId", {}, {}));

//     const updateData: any = {
//       status: state.toUpperCase(),
//     };

//     if (state === "COMPLETED" || state === "FAILED") {
//       updateData.paymentDate = new Date();
//     }

//     let updatedOrder;
//     if (orderType === "workshop") {
//       updatedOrder = await workshopRegisterModel.findOneAndUpdate({ _id: order._id, isDeleted: false }, updateData, { new: true });
//       if (updatedOrder?.status === "COMPLETED") {
//         await userModel.findOneAndUpdate({ _id: updatedOrder.userId }, { $addToSet: { workshopIds: updatedOrder.workshopId } }, { new: true });
//       }
//     } else if (orderType === "course") {
//       updatedOrder = await coursePurchaseModel.findOneAndUpdate({ _id: order._id, isDeleted: false }, updateData, { new: true });
//       if (updatedOrder?.status === "COMPLETED") {
//         await userModel.findOneAndUpdate({ _id: updatedOrder.userId }, { $addToSet: { courseIds: updatedOrder.courseId } }, { new: true });
//       }
//     } else if (orderType === "balance") {
//       updateData.status = state === "COMPLETED" ? BALANCE_STATUS.SUCCESS : BALANCE_STATUS.FAILED;
//       updatedOrder = await balanceModel.findOneAndUpdate({ _id: order._id, isDeleted: false }, updateData, { new: true });
//       if (updatedOrder?.status === BALANCE_STATUS.SUCCESS) {
//         await userModel.findOneAndUpdate({ _id: updatedOrder.userId }, { $inc: { walletBalance: updatedOrder?.amount } }, { new: true });
//       }
//     }

//     if (!updatedOrder) return res.status(200).json(new apiResponse(500, "Failed to update order", {}, {}));
//     return res.status(200).json(new apiResponse(200, "Callback processed successfully", {}, {}));
//   } catch (error) {
//     console.error("PhonePe Payment Callback Error:", error);
//     return res.status(200).json(new apiResponse(500, "Callback received but processing failed", { error: error.message }, {}));
//   }
// };
