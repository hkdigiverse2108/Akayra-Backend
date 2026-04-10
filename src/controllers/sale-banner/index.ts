import { HTTP_STATUS, apiResponse } from "../../common";
import { saleBannerModel } from "../../database";
import { createData, getFirstMatch, reqInfo, responseMessage, updateData } from "../../helper";
import { updateSaleBannerSchema } from "../../validation";

export const get_sale_banner = async (req, res) => {
    reqInfo(req)
    try {
        let banner = await getFirstMatch(saleBannerModel, { isDeleted: false }, {}, { sort: { createdAt: -1 } });
        if (!banner) {
            // If no banner exists, return not found or empty
            return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataNotFound('Sale Banner'), {}, {}));
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('Sale Banner'), banner, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const update_sale_banner = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = updateSaleBannerSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let banner = await getFirstMatch(saleBannerModel, { isDeleted: false }, {}, { sort: { createdAt: -1 } });
        if (!banner) {
            banner = await createData(saleBannerModel, value);
        } else {
            banner = await updateData(saleBannerModel, { _id: banner._id }, value, {});
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess('Sale Banner'), banner, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};
