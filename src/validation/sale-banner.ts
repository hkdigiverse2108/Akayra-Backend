import Joi from 'joi';

export const updateSaleBannerSchema = Joi.object({
    title: Joi.string().required(),
    subtitle: Joi.string().allow('', null),
    image: Joi.string().required(),
    saleEndTime: Joi.date().required(),
    isActive: Joi.boolean().default(true),
});
