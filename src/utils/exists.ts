import { isNil } from 'lodash';
export function exists(x: any): boolean {
  return !isNil(x);
}
