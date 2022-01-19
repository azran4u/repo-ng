import Joi from "joi";
import { ItemDtoSchema } from "./item.dto";

export const SoftwareItemDtoSchema = ItemDtoSchema.keys({
  item_id: Joi.string().required().uuid({ version: "uuidv4" }),
  is_open_source: Joi.boolean(),
}).meta({
  className: "SoftwareItemDto",
});
