const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const clipboardy = require("clipboardy");
const fs = require("fs");

puppeteer.use(StealthPlugin());

const email = "maxkozh06@gmail.com"; // Замініть своєю Google email адресою
const password = "Max190716"; // Замініть своїм Google паролем

async function downloadGoogleData(email, password) {
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
    await page.goto(
      "https://console.cloud.google.com/apis/api/youtube.googleapis.com/metrics"
    );

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
      'div[class="cfc-product-header-content"] button[aria-label="enable this API"]'
    );
    await page.waitForTimeout(3000); // збільшити затримку перед натисканням кнопки

    await page.click(
      'div[class="cfc-product-header-content"] button[aria-label="enable this API"]'
    );

    await page.waitForNavigation({ timeout: 600000 });
  } catch (error) {
    console.log(error);
  }
}

downloadGoogleData(email, password);
