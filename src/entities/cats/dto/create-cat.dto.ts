import { Min } from "class-validator";
import { CatTypeEnum, CreateCatInput } from "../../../graphql.schema";

export class CreateCatDto extends CreateCatInput {
  @Min(1)
  age: number;
  ownerId?: number;
  type: CatTypeEnum;
}
