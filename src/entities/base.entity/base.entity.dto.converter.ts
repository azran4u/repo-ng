import { BaseEntityDto } from "../../dal/dal.types";
import { BaseEntity, ClassificationEnum } from "../../generated/graphql";

export function baseEntityDtoToBaseEntityConverter(
  dto: BaseEntityDto
): BaseEntity {
  return {
    id: dto.id,
    createdBy: dto.created_by,
    creationTime: dto.created_at,
    realityId: dto.reality_id,
    classification: dto.classification as ClassificationEnum,
    isClassified: dto.is_classified,
    isDeleted: dto.is_deleted,
    lastUpdateBy: dto.updated_by,
    secGroups: dto.sec_groups,
  };
}
