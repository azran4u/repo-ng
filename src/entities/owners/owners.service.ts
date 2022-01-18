import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import * as _ from "lodash";
import { InjectKnex } from "nestjs-knex";
import { Owner } from "../../generated/graphql";
@Injectable()
export class OwnersService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async findByIds(ids: readonly number[]): Promise<Owner[]> {
    if (_.isEmpty(ids)) return [];
    return this.knex.from("owners").whereIn("id", ids);
  }
}
