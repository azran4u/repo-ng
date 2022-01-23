import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as _ from "lodash";
import { DalService } from "../../dal/dal.service";
import { ContainerDto } from "../../dal/dal.types";
import { StorageLocationsEnum } from "../../generated/graphql";

@Injectable()
export class ContainerService {
  constructor(private dalService: DalService) {}

  async findByIds(ids: readonly string[]): Promise<ContainerDto[]> {
    if (_.isEmpty(ids)) return [];

    try {
      const containerDtos: ContainerDto[] = await this.dalService.knex
        .from("containers")
        .whereIn("id", ids);

      return containerDtos ?? [];
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `error in ContainerService -> findByItemsIds ${error?.message}`
      );
    }
  }
  async findAllByFilter(
    withItems: boolean = false,
    byLocation?: StorageLocationsEnum[]
  ): Promise<ContainerDto[]> {
    try {
      // select a.*, b.*
      // from "containers" as "a"
      // inner join "items" as "b"
      // on "a"."id" = "b"."container_id"
      // where "location" in ( 'SOUTH', 'NORTH')
      let query;

      if (withItems) {
        query = this.dalService.knex.select(
          "containers.*",
          "items.id as item_id"
        );
        query.from("containers");
        query.innerJoin("items", "containers.id", "items.container_id");
      } else {
        query = this.dalService.knex.from("containers");
      }

      if (byLocation && byLocation.length > 0) {
        query.whereIn("location", byLocation);
      }

      // @ts-ignore
      const containerDtos = await query;
      debugger;

      return containerDtos ?? [];
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `error in ContainerService -> findByItemsIds ${error?.message}`
      );
    }
  }
}
