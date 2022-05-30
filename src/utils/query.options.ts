import { Cursor } from './cursor';

export interface QueryOptions {
  cursor: Cursor;
  limit: number;
  filterDeleted: boolean;
}
