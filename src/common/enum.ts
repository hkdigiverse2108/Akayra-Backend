export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
} as const;

export const BANNER_TYPE = {
  HERO: "hero",
  DISCOUNT: "discount",
} as const;

export const COUPON_TYPE = {
  PERCENT_OFF: "percentOff",
  FLAT_OFF: "flatOff",
  BUY_X_GET_Y: "buyXgetY",
  PREPAID_DISCOUNT: "prepaidDiscount",
} as const;

export const POLICY_TYPE = {
  RETURN_REFUND: "returnRefund",
  PRIVACY: "privacy",
  TERMS_CONDITION: "termsCondition",
  SHIPPING: "shipping",
  CANCELLATION: "cancellation",
} as const;

export const CART_STATUS = {
  PENDING: "pending",
  CLEAR: "clear",
  PURCHASE: "purchase",
  PAYMENT_FAIL: "payment_fail",
} as const;

export const PRODUCT_SORT = {
  PRICE_ASC: "priceAsc",
  PRICE_DESC: "priceDesc",
  NAME_ASC: "nameAsc",
  NAME_DESC: "nameDesc",
  RATING_DESC: "ratingDesc",
} as const;

export const SORT_BY_NAME = {
  NAME_ASC: "nameAsc",
  NAME_DESC: "nameDesc",
} as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURN_REQUESTED: "returnRequested",
  RETURNED: "returned",
  REFUNDED: "refunded",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
  COD: "cod",
} as const;

export const PAYMENT_METHOD = {
  RAZORPAY: "razorpay",
  CASHFREE: "cashfree",
  PHONEPE: "phonePe",
  COD: "cod",
} as const;

export const IG_POST_TYPE = {
  IMAGE: "image",
  VIDEO: "video",
} as const;
