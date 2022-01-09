import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { InjectKnex } from "nestjs-knex";
import { Logger } from "winston";
import { Cat } from "../../graphql.schema";
import { knexLogger } from "../../utils/knexLogger";
import { CreateCatDto } from "./dto/create-cat.dto";

@Injectable()
export class CatsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectKnex() private readonly knex: Knex
  ) {
    knexLogger(this.knex, this.logger);
  }

  async create(cat: CreateCatDto[]): Promise<Cat[]> {
    //@ts-ignore
    return this.knex<CreateCatDto[]>("cats")
      .insert(cat)
      .onConflict("id")
      .merge()
      .returning("*");
  }

  async findAll(): Promise<Cat[]> {
    return this.knex.select<Cat>().table("cats");
  }

  async findOneById(id: number): Promise<Cat> {
    return this.knex<Cat>("cats").where("id", id).first();
  }
}
