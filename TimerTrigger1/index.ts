import { AzureFunction, Context } from "@azure/functions";
const puppeteer = require("puppeteer");

const timerTrigger: AzureFunction = async function (
  context: Context,
  myTimer: any
): Promise<void> {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://google.com/");
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    context.log(`read google.com`);
    await browser.close();
  } catch (error) {
    context.log(error);
  }
};

export default timerTrigger;
