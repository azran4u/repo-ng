import Joi from "joi";
import { baseEntityDtoSchema } from "./base.entity.dto";

export const ItemDtoSchema = baseEntityDtoSchema
  .keys({ name: Joi.string().required() })
  .meta({
    className: "ItemDto",
  });
