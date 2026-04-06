import { HTTP_STATUS, apiResponse, isValidObjectId, resolvePagination, resolveSortAndFilter } from "../../common";
import { faqModel } from "../../database";
import { countData, createData, deleteData, getData, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { addFaqSchema, editFaqSchema, deleteFaqSchema, getFaqByIdSchema, getFaqsSchema } from "../../validation";

export const add_faq = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = addFaqSchema.validate(req.body || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const isExist = await getFirstMatch(faqModel, { priority: value.priority, isDeleted: false }, {}, {});
    if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.dataAlreadyExist("FAQ priority"), {}, {}));

    const response = await createData(faqModel, value);
    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.addDataSuccess("FAQ"), response, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
  }
};

export const edit_faq_by_id = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = editFaqSchema.validate(req.body || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const isPriorityExisting = await getFirstMatch(faqModel, { priority: value.priority, isDeleted: false, _id: { $ne: isValidObjectId(value?.faqId) } }, {}, {});
    if (isPriorityExisting) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.dataAlreadyExist("FAQ priority"), {}, {}));

    const response = await updateData(faqModel, { _id: isValidObjectId(value.faqId) }, value, {});
    if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("FAQ"), {}, {}));
    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess("FAQ"), response, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
  }
};

export const delete_faq_by_id = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = deleteFaqSchema.validate(req.params || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const response = await deleteData(faqModel, { _id: isValidObjectId(value.id) });
    if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound("FAQ"), {}, {}));
    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess("FAQ"), response, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
  }
};

export const get_all_faq = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = getFaqsSchema.validate(req.query || {});
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

    const { faqCategoryFilter, sortFilter } = value;
    const { criteria, options, page, limit } = resolveSortAndFilter(value, ["question", "answer"]);

    if (faqCategoryFilter) criteria.faqCategoryId = isValidObjectId(faqCategoryFilter);
    if (!sortFilter) options.sort = { priority: 1, createdAt: -1 };

    const response = await getData(faqModel, criteria, {}, options);
    const totalCount = await countData(faqModel, criteria);
    return res.status(HTTP_STATUS.OK).json(
      new apiResponse(
        HTTP_STATUS.OK,
        responseMessage.getDataSuccess("FAQ"),
        {
          faq_data: response,
          totalData: totalCount,
          state: resolvePagination(page, limit),
        },
        {},
      ),
    );
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
  }
};

export const get_faq_by_id = async (req, res) => {
  reqInfo(req);
  try {
    const { error, value } = getFaqByIdSchema.validate(req.params);
    if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error?.details[0]?.message, {}, {}));

    const response = await getFirstMatch(faqModel, { _id: isValidObjectId(value.id), isDeleted: false }, {}, {});
    if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage?.getDataNotFound("FAQ"), {}, {}));
    return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage?.getDataSuccess("FAQ"), response, {}));
  } catch (error) {
    console.log(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage?.internalServerError, {}, error));
  }
};
