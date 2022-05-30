import { DeletedField } from './deleted.field';
import { DvField } from './dv.field';
import { IdField } from './id.field';

export interface QueryResult extends IdField, DvField, DeletedField {}
