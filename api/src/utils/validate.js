import Joi from 'joi';
export const schemas = {
  builderPrice: Joi.object({
    starter_id:Joi.number().integer().required(),
    ring_id:Joi.number().integer().required(),
    top_id:Joi.number().integer().required(),
    quantity:Joi.number().integer().min(1).default(1)
  })
};
export const v = (schema, data) => {
  const { value, error } = schema.validate(data);
  if (error) { const msg = error.details?.[0]?.message || 'Invalid input'; const e=new Error(msg); e.status=422; throw e; }
  return value;
};
