import Joi from "joi";

export const deleteImageSchema = Joi.object({
    fileUrl: Joi.string().required(),
});
