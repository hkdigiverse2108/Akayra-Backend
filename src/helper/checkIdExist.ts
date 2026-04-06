import { apiResponse, HTTP_STATUS, isValidObjectId } from "../common";
import { getFirstMatch } from "./database-service";
import { responseMessage } from "./response";

export const checkIdExist = async (model, id, name, res) => {
  if (!id) return true;

  const exists = await getFirstMatch(model, { _id: isValidObjectId(id), isDeleted: false }, {}, {});

  if (!exists) {
    if (res) res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, responseMessage?.getDataNotFound(name), {}, {}));
    return false;
  }
  return true;
};
