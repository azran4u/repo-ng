import { Injectable } from "@nestjs/common";
import * as _ from "lodash";
import { DalService } from "../../dal/dal.service";
import { ContainerDto } from "../../dal/dal.types";
import { Container } from "../../generated/graphql";
import { containerDtoToContainerConverter } from "./container.dto.converter";
import { ContainerWithReferences } from "./container.with.references";
@Injectable()
export class ContainerService {
  constructor(private dalService: DalService) {}

  async findByItemsIds(
    ids: readonly string[]
  ): Promise<ContainerWithReferences[]> {
    if (_.isEmpty(ids)) return [];

    // SELECT *
    // FROM containers as "a"
    // INNER JOIN container_items as "b" ON a.id = b.container_id
    // WHERE b.item_id = 'c7cb1eca-9fe0-417c-9e2a-0929af74863c'

    try {
      const containerDtos: ContainerDto[] = await this.dalService.knex
        .from("containers")
        .innerJoin(
          "container_items as b",
          "containers.id",
          "=",
          "b.container_id"
        )
        .whereIn("b.item_id", ids);

      const containerWithReferences = containerDtos.map((dto) =>
        containerDtoToContainerConverter(dto)
      );
      return containerWithReferences;
    } catch (error) {
      debugger;
    }
  }
}
