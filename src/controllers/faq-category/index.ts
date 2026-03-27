import { HTTP_STATUS, apiResponse, isValidObjectId } from '../../common';
import { faqCategoryModel } from '../../database';
import { createData, deleteData, getData, getFirstMatch, reqInfo, responseMessage, updateData } from '../../helper';
import { addFaqCategorySchema, editFaqCategorySchema, deleteFaqCategorySchema } from '../../validation';

export const add_faq_category = async (req, res) => {
    reqInfo(req);
    try {
        const { error, value } = addFaqCategorySchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let isExist = await getFirstMatch(faqCategoryModel, { title: value.title, isDeleted: false }, {}, {});
        if (isExist) return res.status(HTTP_STATUS.CONFLICT).json(new apiResponse(HTTP_STATUS.CONFLICT, responseMessage?.dataAlreadyExist("title"), {}, {}));

        const response = await createData(faqCategoryModel, value);
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.addDataSuccess('FAQ Category'), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const edit_faq_category_by_id = async (req, res) => {
    reqInfo(req);
    try {
        const { error, value } = editFaqCategorySchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const response = await updateData(faqCategoryModel, { _id: isValidObjectId(value.faqCategoryId) }, value, {});
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('FAQ Category'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess('FAQ Category'), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const delete_faq_category_by_id = async (req, res) => {
    reqInfo(req);
    try {
        const { error, value } = deleteFaqCategorySchema.validate(req.params || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        const response = await deleteData(faqCategoryModel, { _id: isValidObjectId(value.id) });
        if (!response) return res.status(HTTP_STATUS.NOT_FOUND).json(new apiResponse(HTTP_STATUS.NOT_FOUND, responseMessage.getDataNotFound('FAQ Category'), {}, {}));
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.deleteDataSuccess('FAQ Category'), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const get_all_faq_category = async (req, res) => {
    reqInfo(req);
    try {
        const response = await getData(faqCategoryModel, { isDeleted: false }, {}, { lean: true, sort: { createdAt: -1 } });
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('FAQ Category'), response, {}));
    } catch (error) {
        console.log(error);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};
