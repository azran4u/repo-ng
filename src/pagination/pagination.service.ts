import { Injectable } from '@nestjs/common';
import { maxBy } from 'lodash';
import { PersistencyService } from '../persistency/persistency.service';
import { Cursor } from '../utils/cursor';
import { ID } from '../utils/id';
import { nextDv } from '../utils/next.dv';
import { PaginationResult } from '../utils/pagination.result';
import { QueryFilters } from '../utils/query.filters';
@Injectable()
export class PaginationService {
  constructor(private persistencyService: PersistencyService) {}
  async replicateEntities(
    queryFilters: QueryFilters,
    cursor: Cursor,
    limit = 100
  ): Promise<PaginationResult> {
    const result: PaginationResult = {
      updatedEntities: [],
      deletedEntities: [],
      nextCursor: { dv: null, id: null },
    };

    let dataIncludingDeleted = await this.persistencyService.queryEntity(
      queryFilters,
      {
        cursor,
        limit,
        filterDeleted: false,
      }
    );

    dataIncludingDeleted.filter((item) => item.id !== cursor.id);

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

    let lastId: ID;
    let lastDv = maxBy(dataIncludingDeleted, (x) => +x.dv).dv;
    if (lastDv) {
      lastId = maxBy(
        dataIncludingDeleted.filter((x) => x.dv === lastDv),
        (x) => x.id
      ).id;
    } else {
      lastDv = nextDv(cursor.dv);
      lastId = null;
    }

    result.nextCursor = { dv: lastDv, id: lastId };
    return result;
  }
}
