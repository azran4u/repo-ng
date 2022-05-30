import { Injectable } from '@nestjs/common';
import { QueryFilters } from '../utils/query.filters';
import { QueryOptions } from '../utils/query.options';
import { QueryResult } from '../utils/query.results';

@Injectable()
export abstract class PersistencyService {
  abstract queryEntity(
    filter: QueryFilters,
    options?: QueryOptions
  ): Promise<QueryResult[]>;
}
