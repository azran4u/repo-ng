import { Min } from "class-validator";
import { CatTypeEnum, CreateCatInput } from "../../../generated/graphql";

export class CreateCatDto implements CreateCatInput {
  @Min(1)
  age: number;
  ownerId?: number;
  type: CatTypeEnum;
}
