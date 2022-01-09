import DataLoader from "dataloader";
import { Owner } from "../../graphql.schema";
import { mapFromArray } from "../../utils/mapFromArray";
import { OwnersService } from "./owners.service";

export function createOwnersLoader(ownersService: OwnersService) {
  return new DataLoader<number, Owner>(async (ids) => {
    const users = await ownersService.findByIds(ids);
    const usersMap = mapFromArray(users, (user) => user.id);
    return ids.map((id) => usersMap[id]);
  });
}
