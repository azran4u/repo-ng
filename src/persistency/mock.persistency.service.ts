import { Injectable } from '@nestjs/common';
import { compareEntities } from '../utils/compare.entities';
import { Cursor } from '../utils/cursor';
import { DeletedField } from '../utils/deleted.field';
import { exists } from '../utils/exists';
import { QueryFilters } from '../utils/query.filters';
import { QueryOptions } from '../utils/query.options';
import { QueryResult } from '../utils/query.results';
import { PersistencyService } from './persistency.service';

export interface MockData extends Cursor, DeletedField {
  name: string;
}

@Injectable()
export class MockPersistencyService extends PersistencyService {
  private data: MockData[] = [];

  async seed(data: MockData[]) {
    this.data = data;
  }

  async queryEntity(
    filter: QueryFilters,
    options?: QueryOptions
  ): Promise<QueryResult[]> {
    const { cursor, limit, filterDeleted = false } = options;

    let stage = this.data;

    if (filterDeleted) {
      stage = this.data.filter((item) => item.isDeleted === false);
    }

    if (exists(filter)) {
      stage = stage.filter((item) => item.name.includes(filter.byName));
    }

    if (exists(cursor)) {
      stage = stage.filter((item) => {
        const itemChangedAfterCursor = compareEntities(item, cursor);
        if (itemChangedAfterCursor < 0) return false;
        return true;
      });
    }

    if (exists(limit)) {
      stage = stage.sort(compareEntities);
      stage = stage.slice(0, limit);
    }

    return stage.map((item) => {
      return { id: item.id, dv: item.dv, isDeleted: item.isDeleted };
    });
  }
}
