import Joi from "joi";

export const createSchoolDto = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    address: Joi.string().min(5).max(255).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
});

export const updateSchoolDto = Joi.object({
    name: Joi.string().min(3).max(255),
    address: Joi.string().min(5).max(255),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180)
}).min(1);