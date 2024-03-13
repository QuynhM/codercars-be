const Joi = require("joi");

const createCarSchema = Joi.object({
    make: Joi.string().min(1).required(),
    model: Joi.string().min(1).required(),
    release_date: Joi.number().min(1900).required(),
    transmission_type: Joi.string().valid(
        'MANUAL',
        'AUTOMATIC',
        'AUTOMATED_MANUAL',
        'DIRECT_DRIVE',
        'UNKNOWN'
    ).required(),
    size: Joi.string().valid('Compact', 'Midsize', 'Large').required(),
    style: Joi.string().required(),
    price: Joi.number().required(),
  }).options({ abortEarly: false });
  
  const editCarSchema = Joi.object({
    make: Joi.string().required(),
    model: Joi.string().required(),
    release_date: Joi.number().integer().min(1900).required(),
    transmission_type: Joi.string().valid(
        'MANUAL',
        'AUTOMATIC',
        'AUTOMATED_MANUAL',
        'DIRECT_DRIVE',
        'UNKNOWN'
    ).required(),
    size: Joi.string().valid('Compact', 'Midsize', 'Large').required(),
    style: Joi.string().required(),
    price: Joi.number().required(),
});
  
  
module.exports = {
    createCarSchema,
    editCarSchema,
};