export interface ScrapConfig {
  filepath: string;
  rabbiUrl: string;
  retries: number;
}
export interface LoggerConfig {
  level: string;
}

export interface TelegramConfig {
  token: string;
  chatId: string;
}

export interface ObjectStorageConfig {
  connectionString: string;
  containerName: string;
}

export interface Configuration {
  logger: LoggerConfig;
  scrap: ScrapConfig;
  telegram: TelegramConfig;
  objectStorage: ObjectStorageConfig;
}

export function configFactory(): Configuration {
  return {
    logger: {
      level: process.env.LOGGER_LEVEL || "debug",
    },
    scrap: {
      filepath: process.env.SCRAP_FILEPATH || "./lessons.json",
      rabbiUrl:
        process.env.SCRAP_RABBI_URL ||
        "https://meirtv.com/beth-hamidrash-search/?_rabbis=3988",
      retries: parseInt(process.env.SCRAP_RETRIES, 10) || 3,
    },
    telegram: {
      token: process.env.TELEGRAM_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID || "-607122249",
    },
    objectStorage: {
      connectionString: process.env.OBJECT_STORAGE_CONNECTION_STRING,
      containerName: process.env.OBJECT_STORAGE_CONTAINER_NAME || "lessons",
    },
  };
}
