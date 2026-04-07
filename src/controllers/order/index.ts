import { apiResponse, HTTP_STATUS, isValidObjectId, resolvePagination, resolveSortAndFilter, USER_ROLES } from "../../common";
import { addressModel, orderModel, productModel, userModel } from "../../database";
import { checkIdExist, countData, createData, findAllWithPopulate, getData, getFirstMatch, reqInfo, responseMessage } from "../../helper";
import { addOrderSchema, getOrderByIdSchema, getOrdersSchema } from "../../validation";

export const addOrder = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value } = addOrderSchema.validate(req.body || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    let userId = value.userId || user?._id;
    if (userId) {
      userId = isValidObjectId(userId);
      if (!userId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.invalidId("User"), {}, {}));

      const existingUser = await getFirstMatch(userModel, { _id: userId, isDeleted: false }, {}, {});
      if (!existingUser) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("User"), {}, {}));
    } else {
      let existingUser = await getFirstMatch(userModel, { email: value.email, isDeleted: false }, {}, {});
      if (!existingUser) {
        existingUser = await createData(userModel, { email: value.email, firstName: value.firstName, lastName: value.lastName, roles: USER_ROLES.USER, isActive: true, isDeleted: false });
      }
      userId = existingUser?._id;
    }
    value.userId = userId;

    if (!value.addressId && !value.shippingAddress) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, "Shipping address required", {}, {}));

    if (value.addressId) {
      const addressId = isValidObjectId(value.addressId);
      if (!addressId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.invalidId("Address"), {}, {}));

      const address = await getFirstMatch(addressModel, { _id: addressId, isDeleted: false }, {}, {});
      if (!address) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Address"), {}, {}));

      value.addressId = addressId;
      value.shippingAddress = { country: address.country, address1: address.address1, address2: address.address2, city: address.city, state: address.state, pinCode: address.pinCode, default: Boolean(address.isDefault) };
    } else {
      const address = value.shippingAddress;
      const createdAddress = await createData(addressModel, { userId, country: address.country, address1: address.address1, address2: address.address2 || "", city: address.city, state: address.state, pinCode: address.pinCode, isDefault: Boolean(address.default), isActive: true, isDeleted: false });

      value.addressId = createdAddress?._id;
    }

    if (value?.items?.length) await Promise.all(value.items.map((item) => checkIdExist(productModel, item.productId, "Product", res))).then((results) => results.some((r) => !r));

    const response = await createData(orderModel, value);
    if (!response) return res.status(HTTP_STATUS.NOT_IMPLEMENTED).json(new apiResponse(HTTP_STATUS.NOT_IMPLEMENTED, responseMessage?.addDataError, {}, {}));

    return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, responseMessage.addDataSuccess("Order"), response, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const getAllOrder = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = getOrdersSchema.validate(req.query || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const { criteria, options, page, limit } = resolveSortAndFilter(value, ["orderId", "email"]);

    if (value.orderStatusFilter) criteria.orderStatus = value.orderStatusFilter;
    if (value.paymentStatusFilter) criteria.paymentStatus = value.paymentStatusFilter;

    const populate = [
      { path: "items.productId", select: "title" },
      { path: "items.colorId", select: "name" },
      { path: "items.sizeId", select: "name" },
    ];

    const response = await findAllWithPopulate(orderModel, criteria, {}, options, populate);
    const totalCount = await countData(orderModel, criteria);

    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Orders"), { order_data: response, totalData: totalCount, state: resolvePagination(page, limit) }, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const getOrderById = async (req, res) => {
  reqInfo(req);
  try {
    const { value, error } = getOrderByIdSchema.validate(req.params || {});
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.message, {}, {}));
    }

    const order = await orderModel.findById(value.id).populate("items.productId", "name").lean();
    if (!order) {
      return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, "Not found", {}, {}));
    }

    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, "Order", order, {}));
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, "Server error", {}, error));
  }
};