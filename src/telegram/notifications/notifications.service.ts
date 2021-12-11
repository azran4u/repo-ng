import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Telegraf } from "telegraf";
import { Logger } from "winston";

@Injectable()
export class NotificationsService {
  private bot: Telegraf;
  private chatId: string;
  private token: string;
  constructor(
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger
  ) {
    this.token = this.configService.get<string>("telegram.token", {
      infer: true,
    });
    this.chatId = this.configService.get<string>("telegram.chatId", {
      infer: true,
    });
    if (!this.token) {
      throw new Error(`connection to telegram faild, token is missing`);
    }
    this.bot = new Telegraf(this.token);
  }

  async sendMessage(message: string) {
    try {
      await this.bot.telegram.sendMessage(this.chatId, message);
    } catch (error) {
      throw new Error(`send to telegram failed. ${message} ${error}`);
    }
  }
}
