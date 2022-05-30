import { Cursor } from './cursor';
import { ID } from './id';

export interface PaginationResult {
  updatedEntities: ID[];
  deletedEntities: ID[];
  nextCursor: Cursor;
}
