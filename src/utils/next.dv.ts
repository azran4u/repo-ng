import { isNaN } from 'lodash';
import { DV } from './dv';
export function nextDv(dv: DV): DV {
  const toNumber = +dv;
  if (isNaN(toNumber))
    throw new Error(`cannot calculate next data version ${dv}`);
  return (dv + 1).toString();
}
