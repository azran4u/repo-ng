import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectKnex } from "nestjs-knex";
import { Owner } from "../../graphql.schema";
import * as _ from "lodash";
@Injectable()
export class OwnersService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async findOneById(id: number): Promise<Owner> {
    if (_.isNil(id)) return undefined;
    return this.knex<Owner>("owners").where("id", id).first();
  }
}
