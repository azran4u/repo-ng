import { Injectable } from '@nestjs/common';
import { maxBy } from 'lodash';
import { AppConfigService } from '../config';
import { PersistencyService } from '../persistency/persistency.service';
import { Cursor } from '../utils/cursor';
import { PaginationResult } from '../utils/pagination.result';
import { QueryFilters } from '../utils/query.filters';
@Injectable()
export class PaginationService {
  constructor(
    private persistencyService: PersistencyService,
    private configService: AppConfigService
  ) {}
  async replicateEntities(
    queryFilters: QueryFilters,
    cursor: Cursor,
    pageSize
  ): Promise<PaginationResult> {
    const pageSizeConfig = this.configService.getConfig().pagination.pageSize;
    if (pageSize < pageSizeConfig.min) {
      pageSize = pageSizeConfig.min;
    }

    if (pageSize > pageSizeConfig.max) {
      pageSize = pageSizeConfig.max;
    }

    const result: PaginationResult = {
      updatedEntities: [],
      deletedEntities: [],
      nextCursor: { dv: null, id: null },
    };

    let dataIncludingDeleted = await this.persistencyService.queryEntity(
      queryFilters,
      {
        cursor,
        pageSize,
        filterDeleted: false,
      }
    );

    dataIncludingDeleted = dataIncludingDeleted.filter(
      (item) => item.id !== cursor.id
    );

    result.updatedEntities.push(
      ...dataIncludingDeleted
        .filter((item) => item.isDeleted === false)
        .map((x) => x.id)
    );

    result.deletedEntities.push(
      ...dataIncludingDeleted
        .filter((item) => item.isDeleted === true)
        .map((x) => x.id)
    );

    result.nextCursor.dv = maxBy(dataIncludingDeleted, (x) => +x.dv)?.dv;
    if (result.nextCursor.dv) {
      result.nextCursor.id = maxBy(
        dataIncludingDeleted.filter((x) => x.dv === result.nextCursor.dv),
        (x) => x.id
      )?.id;
    } else {
      result.nextCursor = cursor;
    }

    return result;
  }
}
