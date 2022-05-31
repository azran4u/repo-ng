import { isEqual } from 'lodash';
import { PaginationService } from '../pagination/pagination.service';
import { Cursor } from './cursor';
import { ID } from './id';
import { QueryFilters } from './query.filters';

export async function replicationClient(
  initialCursor: Cursor,
  filter: QueryFilters,
  pageSize: number,
  paginationService: PaginationService
) {
  let currentCursor = initialCursor;
  let result: ID[] = [];

  let page = await paginationService.replicateEntities(
    filter,
    currentCursor,
    pageSize
  );
  result.push(...page.updatedEntities);
  result = result.filter((x) => !page.deletedEntities.includes(x));

  while (!isEqual(page.nextCursor, currentCursor)) {
    const a = isEqual(page.nextCursor, currentCursor);
    currentCursor = page.nextCursor;
    page = await paginationService.replicateEntities(
      filter,
      currentCursor,
      pageSize
    );
    result.push(...page.updatedEntities);
    result = result.filter((x) => !page.deletedEntities.includes(x));
  }

  return result;
}
