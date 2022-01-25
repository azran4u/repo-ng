import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as _ from "lodash";
import { DalService } from "../../dal/dal.service";
import { ContainerDto } from "../../dal/dal.types";
import { Container, ContainersFilter } from "../../generated/graphql";
import { ItemsService } from "../items/items.service";
import { containerDtoToContainerConverter } from "./container.dto.converter";

@Injectable()
export class ContainerService {
  constructor(
    private dalService: DalService,
    private itemsService: ItemsService
  ) {}

  async getByIds(ids: readonly string[]): Promise<ContainerDto[]> {
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
  async getByFilter(filter?: ContainersFilter): Promise<Container[]> {
    try {
      const query = this.dalService.knex.from("containers");

      if (filter?.byLocation) {
        query.whereIn("location", filter.byLocation);
      }

      const containerDtos: ContainerDto[] = await query;

      if (_.isNil(containerDtos)) return [];

      return containerDtos.map((containerDto) =>
        containerDtoToContainerConverter(containerDto)
      );
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `error in ContainerService -> findByItemsIds ${error?.message}`
      );
    }
  }
}
