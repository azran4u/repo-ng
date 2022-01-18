import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Knex } from "knex";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { InjectKnex } from "nestjs-knex";
import { Logger } from "winston";
import { Configuration } from "../config/config.factory";
import { knexLogger } from "../utils/knexLogger";

@Injectable()
export class DalService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectKnex() public readonly knex: Knex,
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
}
