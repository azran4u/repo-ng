import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { Owner } from "../../graphql.schema";
import * as _ from "lodash";
import { InjectKnex } from "nestjs-knex";
@Injectable()
export class OwnersService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async findByIds(ids: readonly number[]): Promise<Owner[]> {
    if (_.isEmpty(ids)) return [];
    return this.knex.from("owners").whereIn("id", ids);
  }
}
