import { isNaN } from 'lodash';
import { DV } from './dv';
export function nextDv(dv: DV): DV {
  if (isNaN(dv)) throw new Error(`cannot calculate next data version ${dv}`);
  return dv + 1;
}
