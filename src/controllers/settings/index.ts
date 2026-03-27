import { HTTP_STATUS, apiResponse } from '../../common';
import { settingsModel } from '../../database';
import { createData, getFirstMatch, reqInfo, responseMessage, updateData } from '../../helper';
import { updateSettingsSchema } from '../../validation';

export const get_settings = async (req, res) => {
    reqInfo(req)
    try {
        let settings = await getFirstMatch(settingsModel, {}, {}, {});
        if (!settings) {
            // If no settings exist yet, create a default document
            settings = await createData(settingsModel, {});
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.getDataSuccess('Settings'), settings, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};

export const update_settings = async (req, res) => {
    reqInfo(req)
    try {
        const { error, value } = updateSettingsSchema.validate(req.body || {});
        if (error) return res.status(HTTP_STATUS.BAD_REQUEST).json(new apiResponse(HTTP_STATUS.BAD_REQUEST, error.details[0].message, {}, {}));

        let settings: any = await getFirstMatch(settingsModel, {}, {}, {});
        if (!settings) {
            settings = await createData(settingsModel, value);
        } else {
            settings = await updateData(settingsModel, { _id: settings._id }, value, {});
        }
        return res.status(HTTP_STATUS.OK).json(new apiResponse(HTTP_STATUS.OK, responseMessage.updateDataSuccess('Settings'), settings, {}));
    } catch (error) {
        console.log(error)
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json(new apiResponse(HTTP_STATUS.INTERNAL_SERVER_ERROR, responseMessage.internalServerError, {}, error));
    }
};
