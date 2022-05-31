import { Injectable } from '@nestjs/common';
import { QueryFilters } from '../utils/query.filters';
import { QueryOptions } from '../utils/query.options';
import { QueryResult } from '../utils/query.results';

// get all instances of specific entity
// filter - object that contains variables specific to the entity to filter the instances by.
// if filter is empty - don't filter instances.
// options - directive to the query implementation, such as:
//  cursor - from where in the data to start the lookup. if not set defaults to beginning {dv: "1", id: null}
//  pageSize - how many instances to return. if not set defaults to 100. the pageSize includes deleted instances if filterDeleted is false.
//  filterDeleted - should the query return deleted instances. if not set defaults to false.
@Injectable()
export abstract class PersistencyService {
  abstract queryEntity(
    filter: QueryFilters,
    options?: QueryOptions
  ): Promise<QueryResult[]>;
}
