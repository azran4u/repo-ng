import { BaseEntity } from './entity.base';

export function compareEntities(a: BaseEntity, b: BaseEntity) {
  if (a.dv === b.dv) return 0;
  if (a.dv > b.dv) return 1;
  if (b.dv > a.dv) return -1;

  throw new Error(`compareEntities error a.dv = ${a?.dv} b.dv = ${b?.dv}`);
}
