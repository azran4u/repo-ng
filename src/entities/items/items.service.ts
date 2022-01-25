import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GraphQLError } from "graphql";
import Joi from "joi";
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
  MoveItem,
  RemoveItems,
} from "../../generated/graphql";
import { knexBatchUpdate } from "../../utils/knex.batch.update";
import { ItemWithRef, OfficeEquipmentWithRef } from "./item.with.references";
import {
  officeEquipmentItemDtoToOfficeEquipmentItemConverter,
  officeFurnitureItemDtoToOfficeFurnitureConverter,
  softwareItemDtoToSoftwareItemConverter,
} from "./items.dto.converter";
export interface ItemsFilter {
  byEntityType?: ItemTypes[];
  byContainerIds?: readonly string[];
  byItemIds?: readonly string[];
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
      { itemType: ItemTypes.Software, fn: () => this.getSoftwareItems(filter) },
      {
        itemType: ItemTypes.OfficeFurniture,
        fn: () => this.getOfficeFurnitureItems(filter),
      },
      {
        itemType: ItemTypes.OfficeEquipment,
        fn: () => this.getOfficeEquipmentItems(filter),
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

  async getSoftwareItems(
    filter?: Pick<ItemsFilter, "byContainerIds" | "byItemIds">
  ) {
    const query = this.knex
      .from("software")
      .innerJoin("items", "software.item_id", "items.id");

    if (filter?.byContainerIds) {
      query.whereIn("items.container_id", filter.byContainerIds);
    }

    if (filter?.byItemIds) {
      query.whereIn("items.id", filter.byItemIds);
    }

    const softwareItemsDtos: SoftwareItemDto[] = await query;

    const softwareItems = softwareItemsDtos.map((dto) =>
      softwareItemDtoToSoftwareItemConverter(dto)
    );
    return softwareItems?.length > 0 ? softwareItems : [];
  }

  async getOfficeFurnitureItems(
    filter?: Pick<ItemsFilter, "byContainerIds" | "byItemIds">
  ) {
    const query = this.knex
      .from("office_forniture")
      .innerJoin("items", "office_forniture.item_id", "items.id");

    if (filter?.byContainerIds) {
      query.whereIn("items.container_id", filter.byContainerIds);
    }

    if (filter?.byItemIds) {
      query.whereIn("items.id", filter.byItemIds);
    }
    const officeFurnitureItemDtos: OfficeFurnitureItemDto[] = await query;

    const officeFurnitureItems = officeFurnitureItemDtos.map((dto) =>
      officeFurnitureItemDtoToOfficeFurnitureConverter(dto)
    );
    return officeFurnitureItems?.length > 0 ? officeFurnitureItems : [];
  }

  async getOfficeEquipmentItems(
    filter?: Pick<ItemsFilter, "byContainerIds" | "byItemIds">
  ) {
    const query = this.knex
      .from("office_equipment")
      .innerJoin("items", "office_equipment.item_id", "items.id");

    if (filter?.byContainerIds) {
      query.whereIn("items.container_id", filter.byContainerIds);
    }

    if (filter?.byItemIds) {
      query.whereIn("items.id", filter.byItemIds);
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
    if (!input) return [];

    const validationResult = Joi.array()
      .items(
        Joi.object().keys({
          classification: Joi.string().valid(
            ...Object.values(ClassificationEnum)
          ),
          container_id: Joi.string(),
          isClassified: Joi.boolean(),
          isFragile: Joi.boolean(),
          name: Joi.string(),
          realityId: Joi.number().required(),
          secGroups: Joi.array().items(Joi.string()),
        })
      )
      .validate(input);
    if (validationResult.error) {
      throw new GraphQLError(
        `addOfficeEquipment input validation failed ${validationResult.error}`
      );
    }

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

  async moveItems(
    input: MoveItem[],
    entityTypes?: Pick<ItemsFilter, "byEntityType">
  ): Promise<ItemWithRef[]> {
    if (!input) return [];

    const validationResult = Joi.array()
      .items(
        Joi.object().keys({
          item_id: Joi.string().required(),
          container_id: Joi.string().required(),
        })
      )
      .validate(input);
    if (validationResult.error) {
      throw new GraphQLError(
        `moveItems input validation failed ${validationResult.error}`
      );
    }

    try {
      await knexBatchUpdate(
        this.knex,
        "items",
        "id",
        input.map((x) => {
          return { id: x.item_id, container_id: x.container_id };
        })
      );
      return this.getItems({
        byEntityType: entityTypes.byEntityType,
        byItemIds: input.map((x) => x.item_id),
      });
    } catch (error) {
      throw new GraphQLError(`moveItems failed ${error}`);
    }
  }

  async removeItems(input: RemoveItems): Promise<string[]> {
    if (!input) false;

    const validationResult = Joi.object()
      .keys({
        ids: Joi.array().items(Joi.string().required()).required(),
        allowPartialDelete: Joi.boolean(),
      })
      .validate(input);
    if (validationResult.error) {
      throw new GraphQLError(
        `removeItems input validation failed ${validationResult.error}`
      );
    }

    try {
      const trx = await this.knex.transaction();
      const res = await this.knex("items")
        .whereIn("id", input.ids)
        .del()
        .returning("id")
        .transacting(trx);
      if (res.length === input.ids.length || input.allowPartialDelete) {
        await trx.commit();
        return res;
      } else {
        await trx.rollback();
        return [];
      }
    } catch (error) {
      throw new GraphQLError(`removeItems failed ${error}`);
    }
  }
}
