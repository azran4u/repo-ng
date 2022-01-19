import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Knex } from "knex";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { InjectKnex } from "nestjs-knex";
import { Logger } from "winston";
import { AppConfigService } from "../config/app.config.service";
import { knexLogger } from "../utils/knexLogger";

@Injectable()
export class DalService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectKnex() public readonly knex: Knex,
    private configService: AppConfigService
  ) {
    const config = this.configService.getConfig();
    const kenxLogging = config.kenx.logging;
    knexLogger(
      this.knex,
      this.logger,
      kenxLogging.everySql,
      kenxLogging.bindings
    );
  }
}
