import { BaseEntity, ClassificationEnum } from "../../generated/graphql";
import { BaseEntityDto } from "../../dal/dal.types";

export function baseEntityDtoToBaseEntityConverter(
  dto: BaseEntityDto
): BaseEntity {
  return {
    id: dto.id,
    createdBy: dto.created_by,
    creationTime: dto.created_at,
    realityId: dto.reality_id,
    classification: ClassificationEnum[dto.classification],
    isClassified: dto.is_classified,
    isDeleted: dto.is_deleted,
    lastUpdateBy: dto.updated_by,
    secGroups: dto.sec_groups,
  };
}
