import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination, resolveSortAndFilter } from "../../common";
import { addressModel } from "../../database";
import { countData, createData, deleteData, getData, getFirstMatch, reqInfo, responseMessage, updateData, updateMany } from "../../helper";
import { addAddressSchema, deleteAddressSchema, editAddressSchema, getAllAddressSchema } from "../../validation";

const buildAddressPayload = (value: any) => {
  const payload: any = {};
  if (typeof value.country !== "undefined") payload.country = value.country;
  if (typeof value.address1 !== "undefined") payload.address1 = value.address1;
  if (typeof value.address2 !== "undefined") payload.address2 = value.address2;
  if (typeof value.city !== "undefined") payload.city = value.city;
  if (typeof value.state !== "undefined") payload.state = value.state;
  if (typeof value.pinCode !== "undefined") payload.pinCode = value.pinCode;
  if (typeof value.isDefault !== "undefined") payload.isDefault = value.isDefault;
  if (typeof value.isActive !== "undefined") payload.isActive = value.isActive;
  return payload;
};

export const add_address = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value } = addAddressSchema.validate(req.body || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    let isDefault = value.isDefault;
    if (typeof isDefault === "undefined") {
      const existingCount = await countData(addressModel, { userId: user._id, isDeleted: false });
      if (existingCount === 0) isDefault = true;
    }

    if (isDefault) await updateMany(addressModel, { userId: user._id, isDeleted: false }, { isDefault: false }, {});

    const payload = { ...value, userId: user._id, isDefault: Boolean(isDefault) };
    const response = await createData(addressModel, payload);

    return res.status(HTTP_STATUS.CREATED).json(new apiResponse(HTTP_STATUS.CREATED, responseMessage.addDataSuccess("Address"), response, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, {}));
  }
};

export const edit_address = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value } = editAddressSchema.validate(req.body || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const addressId = isValidObjectId(value.addressId);
    if (!addressId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.invalidId("Address"), {}, {}));

    const existing = await getFirstMatch(addressModel, { _id: addressId, isDeleted: false }, {}, {});
    if (!existing) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Address"), {}, {}));

    if (String(existing.userId) !== String(user._id)) return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.accessDenied, {}, {}));

    const payload = buildAddressPayload(value);
    if (Object.keys(payload).length === 0) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.customMessage("Nothing to update"), {}, {}));

    if (payload.isDefault === true) await updateMany(addressModel, { userId: user._id, _id: { $ne: addressId }, isDeleted: false }, { isDefault: false }, {});

    const updated = await updateData(addressModel, { _id: addressId }, payload, {});
    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("Address"), updated, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
  }
};

export const delete_address = async (req, res) => {
  reqInfo(req);
  try {
    const { user } = req.headers;
    const { error, value } = deleteAddressSchema.validate(req.params || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const addressId = isValidObjectId(value.id);
    if (!addressId) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage.invalidId("Address"), {}, {}));

    const existing = await getFirstMatch(addressModel, { _id: addressId, isDeleted: false }, {}, {});
    if (!existing) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("Address"), {}, {}));

    if (String(existing.userId) !== String(user._id)) return res.status(HTTP_STATUS.UNAUTHORIZED).json(new apiResponse(HTTP_STATUS.UNAUTHORIZED, responseMessage.accessDenied, {}, {}));

    await deleteData(addressModel, { _id: addressId });
    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess("Address"), {}, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
  }
};

export const get_all_address = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = getAllAddressSchema.validate(req.body || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const { criteria, options, page, limit } = resolveSortAndFilter(value, ["country", "address1", "address2", "city", "state", "pinCode"]);

    const response = await getData(addressModel, criteria, {}, options);
    const totalCount = await countData(addressModel, criteria);

    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess("Address"), { address_data: response, totalData: totalCount, state: resolvePagination(page, limit) }, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
  }
};
