const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const robot = require("robotjs");
const { db } = require("../model/dbConnection");

puppeteer.use(StealthPlugin());

async function createChannel(email, password) {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();

  const downloadFolder =
    "/Users/andrijkozevnikov/Documents/ProjectYoutube/downloadZIP";
  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadFolder,
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
  );

  try {
    await page.goto("https://studio.youtube.com/");

    await page.type("#identifierId", email);

    await page.click("#identifierNext");
    await page.waitForNavigation({ timeout: 60000 });

    await page.waitForSelector('input[name="Passwd"].whsOnd.zHQkBf', {
      visible: true,
    });
    await page.type('input[name="Passwd"].whsOnd.zHQkBf', password);

    await page.evaluate(() => {
      const nextButton = Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent.includes("Next")
      );
      if (nextButton) nextButton.click();
    });
    await page.waitForSelector(
      'ytd-button-renderer[id="create-channel-button"] button'
    );
    await page.waitForTimeout(1500);
    await page.click('ytd-button-renderer[id="create-channel-button"] button', {
      delay: 1000,
    });

    await page.waitForNavigation({ timeout: 60000 });
  } catch (error) {
    console.error(error);
  }

  setTimeout(async () => {
    await browser.close();
  }, 10000);
}

module.exports = { createChannel };
