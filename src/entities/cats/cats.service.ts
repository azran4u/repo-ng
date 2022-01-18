import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Knex } from "knex";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { InjectKnex } from "nestjs-knex";
import { Logger } from "winston";
import { Configuration } from "../../config/config.factory";
import { Cat } from "../../generated/graphql";
import { knexLogger } from "../../utils/knexLogger";
import { CreateCatDto } from "./dto/create-cat.dto";

@Injectable()
export class CatsService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectKnex() private readonly knex: Knex,
    private configService: ConfigService
  ) {
    const kenxLogging =
      this.configService.get<Configuration>("config").kenx.logging;
    knexLogger(
      this.knex,
      this.logger,
      kenxLogging.everySql,
      kenxLogging.bindings
    );
  }

  async create(cats: CreateCatDto[]): Promise<Cat[]> {
    //@ts-ignore
    return this.knex<CreateCatDto[]>("cats")
      .insert(cats)
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
