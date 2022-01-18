import { Context, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import * as _ from "lodash";
import DataLoader from "dataloader";
import { Cat, Owner } from "../../generated/graphql";
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
