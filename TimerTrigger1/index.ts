import { AzureFunction, Context, Logger } from "@azure/functions";
import { createApp } from "../src/main";

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  const logger: Logger = context.log;
  logger.info("starting app");
  try {
    await createApp(logger);
  } catch (error) {
    console.error(error);
  }
};

export default timerTrigger;
