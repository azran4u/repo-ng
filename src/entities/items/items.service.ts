import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { GraphQLError } from "graphql";
import Joi from "joi";
import { Knex } from "knex";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { Configuration } from "../../config";
import { AppConfigService } from "../../config/app.config.service";
import { DalService } from "../../dal/dal.service";
import {
  CreateItemDto,
  CreateOfficeEquipmentDto,
  ItemDto,
  OfficeEquipmentItemDto,
  OfficeEquipmentItemFieldsDto,
  OfficeEquipmentItemOwnFieldsDto,
  OfficeFurnitureItemDto,
  SoftwareItemDto,
} from "../../dal/dal.types";
import {
  ClassificationEnum,
  ItemTypes,
  MoveItem,
  RemoveItems,
  UpsertOfficeEquipment,
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
  private config: Configuration;
  constructor(
    private dalService: DalService,
    private configService: AppConfigService
  ) {
    this.knex = this.dalService.knex;
    this.config = this.configService.getConfig();
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

  async upsertOfficeEquipment(
    input: UpsertOfficeEquipment[]
  ): Promise<OfficeEquipmentWithRef[]> {
    if (!input) return [];

    const validationResult = Joi.array()
      .items(
        Joi.object().keys({
          id: Joi.string(),
          classification: Joi.string().valid(
            ...Object.values(ClassificationEnum)
          ),
          container_id: Joi.string(),
          isClassified: Joi.boolean(),
          isFragile: Joi.boolean(),
          name: Joi.string(),
          realityId: Joi.number(),
          secGroups: Joi.array().items(Joi.string()),
        })
      )
      .validate(input);
    if (validationResult.error) {
      throw new GraphQLError(
        `upsertOfficeEquipment input validation failed ${validationResult.error}`
      );
    }

    const insertOfficeEquipmentDtos: CreateOfficeEquipmentDto[] = [];
    const insertItemDtos: Partial<CreateItemDto>[] = [];
    const updateOfficeEquipmentDtos: CreateOfficeEquipmentDto[] = [];
    const updateItemDtos: Partial<CreateItemDto>[] = [];

    input.forEach((officeEquipment) => {
      const itemDto = _.omitBy<CreateItemDto>(
        {
          id: officeEquipment.id,
          container_id: officeEquipment.container_id,
          name: officeEquipment.name,
          reality_id: officeEquipment.realityId ?? undefined,
          classification: officeEquipment.classification
            ? (officeEquipment.classification as ClassificationEnum)
            : ClassificationEnum.Unclas,
          is_classified: officeEquipment.isClassified,
          sec_groups: officeEquipment.secGroups,
        },
        _.isNil
      );

      function convertOfficeEquipmentFieldDto(
        upsertOfficeEquipment: UpsertOfficeEquipment
      ): OfficeEquipmentItemOwnFieldsDto {
        return _.omitBy(
          { is_fragile: upsertOfficeEquipment.isFragile },
          _.isNil
        );
      }
      if (_.isNil(itemDto?.id)) {
        itemDto.id = uuidv4();
        const officeEquipmentDto: CreateOfficeEquipmentDto = {
          item_id: itemDto.id,
          ...convertOfficeEquipmentFieldDto(officeEquipment),
        };
        insertItemDtos.push(itemDto);
        insertOfficeEquipmentDtos.push(officeEquipmentDto);
      } else {
        const officeEquipmentDto: CreateOfficeEquipmentDto = {
          item_id: itemDto.id,
          ...convertOfficeEquipmentFieldDto(officeEquipment),
        };
        updateItemDtos.push(itemDto);
        updateOfficeEquipmentDtos.push(officeEquipmentDto);
      }
    });

    let transaction: Knex.Transaction<any, any[]>;
    try {
      transaction = await this.knex.transaction();
    } catch (error) {
      throw new InternalServerErrorException(
        `upsertOfficeEquipment failed ${error.messgae}`
      );
    }

    try {
      // TODO - convert to batch insert / update
      let insertItemsDtosReturn: ItemDto[];
      if (!_.isEmpty(insertItemDtos)) {
        insertItemsDtosReturn = await this.knex("items")
          .transacting(transaction)
          .insert(insertItemDtos)
          .returning("*");
      }

      let insertOfficeEquipmentDtosReturn: OfficeEquipmentItemFieldsDto[];
      if (!_.isEmpty(insertOfficeEquipmentDtos)) {
        insertOfficeEquipmentDtosReturn = await this.knex("office_equipment")
          .transacting(transaction)
          .insert(insertOfficeEquipmentDtos)
          .returning("*");
      }

      let updateItemsDtosReturn: ItemDto[];
      if (!_.isEmpty(updateItemDtos)) {
        updateItemsDtosReturn = await this.knex("items")
          .transacting(transaction)
          .update(updateItemDtos)
          .where("id")
          .returning("*");
      }

      let updateOfficeEquipmentDtosReturn: OfficeEquipmentItemFieldsDto[];
      if (!_.isEmpty(updateItemDtos)) {
        updateOfficeEquipmentDtosReturn = await this.knex("office_equipment")
          .transacting(transaction)
          .update(updateOfficeEquipmentDtos)
          .returning("*");
      }

      const itemsDtosReturnMap = new Map<string, ItemDto>();
      [...insertItemsDtosReturn, ...updateItemsDtosReturn].forEach((x) =>
        itemsDtosReturnMap.set(x.id, x)
      );
      await transaction.commit();
      return [
        ...insertOfficeEquipmentDtosReturn,
        ...updateOfficeEquipmentDtosReturn,
      ].map((x) => {
        return {
          ...officeEquipmentItemDtoToOfficeEquipmentItemConverter({
            ...x,
            ...itemsDtosReturnMap.get(x.item_id),
          }),
        };
      });
    } catch (error) {
      await transaction.rollback();
      throw new GraphQLError(`upsertOfficeEquipment failed ${error.messgae}`);
    }
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
      const query = this.knex("items").whereIn("id", input.ids).returning("id");

      if (this.config.repo.deletions.logicalDelete) {
        query.update("is_deleted", true);
      } else {
        query.del();
      }
      const trx = await this.knex.transaction();
      const res = await query.transacting(trx);
      const allowPartialDelete =
        this.config.repo.deletions.allowPartialDelete &&
        input.allowPartialDelete;
      if (res.length === input.ids.length || allowPartialDelete) {
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
