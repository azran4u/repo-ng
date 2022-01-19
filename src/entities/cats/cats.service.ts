import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { DalService } from "../../dal/dal.service";
import { Cat } from "../../generated/graphql";
import { CreateCatDto } from "./dto/create-cat.dto";

@Injectable()
export class CatsService {
  private knex: Knex;
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private dalService: DalService
  ) {
    this.knex = this.dalService.knex;
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
