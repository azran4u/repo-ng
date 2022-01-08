import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectKnex } from "nestjs-knex";
import { Owner } from "../../graphql.schema";

@Injectable()
export class OwnersService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async findOneById(id: number): Promise<Owner> {
    return this.knex<Owner>("owners").where("id", id).first();
  }
}
