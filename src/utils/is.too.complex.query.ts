import { GraphQLError } from "graphql";
import { fieldsMap } from "graphql-fields-list";
import * as _ from "lodash";

export function throwIfTooComplex(info: any, path: string[]) {
  const fm = fieldsMap(info);
  const res = _.get(fm, path);
  if (res) throw new GraphQLError(`Query is too complex`);
}
