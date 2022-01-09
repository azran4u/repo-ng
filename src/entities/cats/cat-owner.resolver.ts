import { Context, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Cat, Owner } from "../../graphql.schema";
import * as _ from "lodash";
import DataLoader from "dataloader";
@Resolver("Cat")
export class CatOwnerResolver {
  constructor() {} // private readonly ownersService: OwnersService

  @ResolveField()
  async owner(
    @Parent() cat: Cat & { ownerId: number },
    @Context("ownersLoader") ownersLoader: DataLoader<number, Owner>
  ) {
    if (_.isNil(cat?.ownerId)) return undefined;
    return ownersLoader.load(cat?.ownerId);
  }
}
