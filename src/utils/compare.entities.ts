import { BaseEntity } from './entity.base';
import { exists } from './exists';

export function compareEntities(a: BaseEntity, b: BaseEntity) {
  if (a.dv === b.dv && a.id === b.id) return 0;
  if (a.dv > b.dv) return 1;
  if (b.dv > a.dv) return -1;
  if (!exists(a.id) && exists(b.id)) return -1;
  if (!exists(b.id) && exists(a.id)) return 1;
  if (a.id > b.id) return 1;
  if (b.id > a.id) return -1;
  return 0;
}
