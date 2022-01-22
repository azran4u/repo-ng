import { ResolveField, Resolver } from "@nestjs/graphql";
import * as _ from "lodash";

@Resolver("Container")
export class ItemsResolver {
  constructor() {}

  // we don't allow such nested queries, it's not needed
  @ResolveField("items")
  async getItems() {
    return null;
  }
}
