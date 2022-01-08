import { Injectable } from "@nestjs/common";
import { Knex } from "knex";
import { InjectKnex } from "nestjs-knex";
import { Cat } from "../../graphql.schema";
import { CreateCatDto } from "./dto/create-cat.dto";

@Injectable()
export class CatsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async create(cat: CreateCatDto[]): Promise<Cat[]> {
    //@ts-ignore
    return this.knex<CreateCatDto[]>("cats")
      .insert(cat)
      .onConflict("id")
      .merge()
      .returning("*");

    // cat.id = this.cats.length + 1;
    // this.cats.push(cat);
    // return cat;
  }

  async findAll(): Promise<Cat[]> {
    return this.knex.select<Cat>().table("cats");
  }

  async findOneById(id: number): Promise<Cat> {
    return this.knex<Cat>("cats").where("id", id).first();
  }
}
