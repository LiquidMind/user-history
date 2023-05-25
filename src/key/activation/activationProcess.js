const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());
let isSuccess = false; // відстежує успішність виконання

async function activationProcess(email, password) {
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

    try {
      await page.waitForSelector(
        'div[class="cfc-product-header-content"] button[aria-label="enable this API"]'
      );
      await page.waitForTimeout(3000); // збільшити затримку перед натисканням кнопки

      await page.click(
        'div[class="cfc-product-header-content"] button[aria-label="enable this API"]'
      );
      console.log("Успішно виконано");
      isSuccess = true; // якщо успішно виконано, встановлюємо isSuccess в true
    } catch (error) {
      console.log("АПІ ВЖЕ АКТИВОВАНЕ");
      isSuccess = true; // вважаємо, що якщо API уже активовано, це також успіх
    }
  } catch (error) {
    console.log(error);
    isSuccess = false; // якщо є помилка, встановлюємо isSuccess в false
  } finally {
    if (browser) {
      await browser.close();
    }
  }

  return isSuccess; // повертаємо успішність виконання
}

module.exports = activationProcess;
