import Joi from "joi";

export const baseEntityDtoSchema = Joi.object({
  id: Joi.string().required().uuid({ version: "uuidv4" }),
  reality_id: Joi.number().required(),
  classification: Joi.string(),
  created_at: Joi.date().required(),
  updated_at: Joi.date().required(),
  created_by: Joi.string(),
  updated_by: Joi.string(),
  is_deleted: Joi.boolean().required(),
  is_classified: Joi.boolean().required(),
  sec_groups: Joi.array().items(Joi.string()),
}).meta({
  className: "baseEntityDto",
});
