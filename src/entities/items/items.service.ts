import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";
import { DalService } from "../../dal/dal.service";
import {
  CreateItemDto,
  CreateOfficeEquipmentDto,
  ItemDto,
  OfficeEquipmentItemDto,
  OfficeEquipmentItemFieldsDto,
  OfficeFurnitureItemDto,
  SoftwareItemDto,
} from "../../dal/dal.types";
import {
  AddOfficeEquipment,
  ClassificationEnum,
  ItemTypes,
} from "../../generated/graphql";
import { ItemWithRef, OfficeEquipmentWithRef } from "./item.with.references";
import {
  officeEquipmentItemDtoToOfficeEquipmentItemConverter,
  officeFurnitureItemDtoToOfficeFurnitureConverter,
  softwareItemDtoToSoftwareItemConverter,
} from "./items.dto.converter";
export interface ItemsFilter {
  byEntityType?: ItemTypes[];
  byContainerIds?: readonly string[];
}
@Injectable()
export class ItemsService {
  private knex: Knex;
  constructor(private dalService: DalService) {
    this.knex = this.dalService.knex;
  }

  async getItems(filter: ItemsFilter): Promise<ItemWithRef[]> {
    const queries: Promise<ItemWithRef[]>[] = [];

    const entities: {
      itemType: ItemTypes;
      fn: () => Promise<ItemWithRef[]>;
    }[] = [
      { itemType: ItemTypes.Software, fn: () => this.getAllSoftware(filter) },
      {
        itemType: ItemTypes.OfficeFurniture,
        fn: () => this.getAllOfficeFurniture(filter),
      },
      {
        itemType: ItemTypes.OfficeEquipment,
        fn: () => this.getAllOfficeEquipment(filter),
      },
    ];

    entities.forEach((entity) => {
      if (
        !filter.byEntityType ||
        filter.byEntityType?.includes(entity.itemType)
      ) {
        queries.push(entity.fn());
      }
    });

    try {
      const res = await Promise.all(queries);
      return res.reduce((acc, curr) => {
        acc.push(...curr);
        return acc;
      }, []);
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        `error in ItemsService -> findAll ${error?.message}`
      );
    }
  }

  private async getAllSoftware(filter?: Pick<ItemsFilter, "byContainerIds">) {
    const query = this.knex
      .from("software")
      .innerJoin("items", "software.item_id", "items.id");

    if (filter?.byContainerIds) {
      query.whereIn("items.container_id", filter.byContainerIds);
    }

    const softwareItemsDtos: SoftwareItemDto[] = await query;

    const softwareItems = softwareItemsDtos.map((dto) =>
      softwareItemDtoToSoftwareItemConverter(dto)
    );
    return softwareItems?.length > 0 ? softwareItems : [];
  }

  private async getAllOfficeFurniture(
    filter?: Pick<ItemsFilter, "byContainerIds">
  ) {
    const query = this.knex
      .from("office_forniture")
      .innerJoin("items", "office_forniture.item_id", "items.id");

    if (filter?.byContainerIds) {
      query.whereIn("items.container_id", filter.byContainerIds);
    }

    const officeFurnitureItemDtos: OfficeFurnitureItemDto[] = await query;

    const officeFurnitureItems = officeFurnitureItemDtos.map((dto) =>
      officeFurnitureItemDtoToOfficeFurnitureConverter(dto)
    );
    return officeFurnitureItems?.length > 0 ? officeFurnitureItems : [];
  }

  private async getAllOfficeEquipment(
    filter?: Pick<ItemsFilter, "byContainerIds">
  ) {
    const query = this.knex
      .from("office_equipment")
      .innerJoin("items", "office_equipment.item_id", "items.id");

    if (filter?.byContainerIds) {
      query.whereIn("items.container_id", filter.byContainerIds);
    }

    const officeEquipmentItemDtos: OfficeEquipmentItemDto[] = await query;

    const officeEquipmentItems = officeEquipmentItemDtos.map((dto) =>
      officeEquipmentItemDtoToOfficeEquipmentItemConverter(dto)
    );

    return officeEquipmentItems?.length > 0 ? officeEquipmentItems : [];
  }

  async addOfficeEquipment(
    input: AddOfficeEquipment[]
  ): Promise<OfficeEquipmentWithRef[]> {
    // validate the input
    // start transaction
    // create items
    //    convert input field names to database
    // create software with item_id reference
    //    convert input field names to database

    if (!input) return [];

    const createOfficeEquipmentDtos: CreateOfficeEquipmentDto[] = [];
    const createItemDtos: CreateItemDto[] = [];

    input.forEach((officeEquipment) => {
      const itemDto: CreateItemDto = {
        id: uuidv4(),
        container_id: officeEquipment.container_id,
        name: officeEquipment.name,
        reality_id: officeEquipment.realityId ?? 1,
        classification: officeEquipment.classification
          ? (officeEquipment.classification as ClassificationEnum)
          : ClassificationEnum.Unclas,
        is_classified: officeEquipment.isClassified ?? false,
        sec_groups: officeEquipment.secGroups ?? [],
      };
      const officeEquipmentDto: CreateOfficeEquipmentDto = {
        item_id: itemDto.id,
        is_fragile: officeEquipment.isFragile,
      };
      createItemDtos.push(itemDto);
      createOfficeEquipmentDtos.push(officeEquipmentDto);
    });

    // split the input for both tables
    // start transaction and insert to software and items tables
    // convert the response to OfficeEquipment[]

    let transaction: Knex.Transaction<any, any[]>;
    try {
      transaction = await this.knex.transaction();
    } catch (error) {
      throw new InternalServerErrorException(
        `addOfficeEquipment failed ${error.messgae}`
      );
    }

    try {
      const itemsDtosReturn: ItemDto[] = await this.knex("items")
        .transacting(transaction)
        .insert(createItemDtos)
        .returning("*");
      const officeEquipmentDtosReturn: OfficeEquipmentItemFieldsDto[] =
        await this.knex("office_equipment")
          .transacting(transaction)
          .insert(createOfficeEquipmentDtos)
          .returning("*");
      const itemsDtosReturnMap = new Map<string, ItemDto>();
      itemsDtosReturn.forEach((x) => itemsDtosReturnMap.set(x.id, x));
      await transaction.commit();
      return officeEquipmentDtosReturn.map((x) => {
        return {
          ...officeEquipmentItemDtoToOfficeEquipmentItemConverter({
            ...x,
            ...itemsDtosReturnMap.get(x.item_id),
          }),
        };
      });
    } catch (error) {
      await transaction.rollback();
    }

    return [];
  }
}
