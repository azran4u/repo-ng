import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GraphQLError } from "graphql";
import * as _ from "lodash";
import { DalService } from "../../dal/dal.service";
import { ContainerDto, ContainerDtoWithRef } from "../../dal/dal.types";
import {
  Container,
  ItemTypes,
  StorageLocationsEnum,
} from "../../generated/graphql";
import { ItemsService } from "../items/items.service";
import { containerDtoToContainerConverter } from "./container.dto.converter";

@Injectable()
export class ContainerService {
  constructor(
    private dalService: DalService,
    private itemsService: ItemsService
  ) {}

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
    itemsTypes?: ItemTypes[],
    byLocation?: StorageLocationsEnum[]
  ): Promise<Container[]> {
    try {
      if (withItems) {
        const containerDtos: ContainerDto[] = await this.dalService.knex
          .from("containers")
          .whereIn("location", byLocation);
        const items = await this.itemsService.findAll(itemsTypes);
        const containersMap = new Map<string, Container>();
        containerDtos.map((containerDto) => {
          const container_from_map = containersMap.get(containerDto.id);
          if (!container_from_map) {
            const container = containerDtoToContainerConverter(containerDto);
            container.items = [];
            containersMap.set(container.id, container);
          }
        });
        items.map((item) => {
          if (!item?.container_id)
            throw new GraphQLError(`item ${item.id} doen't have container id`);
          const container_from_map = containersMap.get(item.container_id);
          if (!container_from_map) return;
          container_from_map.items.push(item);
          containersMap.set(container_from_map.id, container_from_map);
        });
        return Array.from(containersMap.values()) ?? [];
      }
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `error in ContainerService -> findByItemsIds ${error?.message}`
      );
    }
    // select to_json(a.*) as aa, to_json(b.*) as bb
    // from "containers" as "a"
    // inner join "items" as "b"
    // on "a"."id" = "b"."container_id"
    // where "location" in ( 'SOUTH', 'NORTH')
    // query = this.dalService.knex.select(
    //   this.dalService.knex.raw(
    //     'row_to_json("containers".*) AS "containers", row_to_json("items".*) AS "items"'
    //   )
    // );
    // query.from("containers");
    // query.innerJoin("items", "containers.id", "items.container_id");

    // return Array.from(containersMap.values());

    // } else {
    //   query = this.dalService.knex.from("containers");
    // }

    // if (byLocation && byLocation.length > 0) {
    //   query.whereIn("location", byLocation);
    // }

    // const containerDtos: Container[] = await query;

    // if (withItems) {
    //   const containersMap = new Map<string, Container>();
    //   containerDtos.map((container) => {
    //     const container_from_map = containersMap.get(container.id);
    //     if (!container_from_map) {
    //       if (_.isNil(container.items)) {
    //         container.items = [];
    //       }
    //       containersMap.set(container.id, container);
    //     } else {
    //       if (!_.isNil(container.items)) {
    //         container_from_map.items.push(...container.items);
    //       }
    //     }
    //   });
    //   return Array.from(containersMap.values());
    // }
    // return containerDtos ?? [];
  }
}
