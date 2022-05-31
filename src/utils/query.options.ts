import { Cursor } from './cursor';

export interface QueryOptions {
  cursor: Cursor;
  pageSize: number;
  filterDeleted: boolean;
}
