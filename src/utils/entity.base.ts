import { DvField } from './dv.field';
import { IdField } from './id.field';

export interface BaseEntity extends IdField, DvField {}
