const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const robot = require("robotjs");
// const { email, password } = require("../dataUser/dataUser");

puppeteer.use(StealthPlugin());

// const email = email; // Replace with your Google email address
// const password = password; // Replace with your Google password

async function downloadGoogleData(email, password) {
  const browser = await puppeteer.launch({
    headless: false,
    // userDataDir: "./puppeteer_data_2",
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

  //==============================================================================================

  // await page.goto("chrome://settings/downloads");

  // await page.keyboard.press("Tab", { delay: 1000 });
  // await page.keyboard.press("Tab", { delay: 1000 });
  // await page.keyboard.press("Enter", { delay: 1000 });

  // // Type the desired folder path

  // robot.typeString(
  //   "/Users/andrijkozevnikov/Documents/ProjectYoutube/downloadZIP"
  // );
  // await page.waitForTimeout(1000);

  // // Press Enter to select the folder and close the file dialog
  // robot.keyTap("enter");

  // await page.waitForTimeout(2000);

  // robot.keyTap("enter");

  // // Add an additional Enter press

  // // Wait for the file dialog to close
  // await page.waitForTimeout(6000);

  // // await page.keyboard.press("Enter", { delay: 1000 });

  // ==============================================================================================
  try {
    await page.goto("https://takeout.google.com/");

    // Вводимо емейл

    await page.type("#identifierId", email);

    //Натискаємо далі
    await page.click("#identifierNext");
    await page.waitForNavigation({ timeout: 60000 });

    //Вводимо пароль
    // Wait for the password input field to become visible

    await page.waitForSelector('input[name="Passwd"].whsOnd.zHQkBf', {
      visible: true,
    });
    await page.type('input[name="Passwd"].whsOnd.zHQkBf', password);

    //   await page.click("#passwordNext");
    //Натискаємо далі
    await page.evaluate(() => {
      const nextButton = Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent.includes("Next")
      );
      if (nextButton) nextButton.click();
    });

    //Знімаємо всі галочки
    // Deselect all products
    await page.waitForSelector('div[jsname="UylMne"] button[jsname="Pr7Yme"]');
    await page.waitForTimeout(1000); // wait for button to be fully loaded

    await page.click('div[jsname="UylMne"] button[jsname="Pr7Yme"]', {
      delay: 250,
    });

    //ставимо галочку на YouTube і YouTube Music
    // Select YouTube і YouTube Music
    await page.waitForSelector(
      'div[data-id="youtube"][data-enabled="true"] div[data-indeterminate="false"][jsname="PE3haf"] input[type="checkbox"][jsname="YPqjbf"]'
    );
    await page.click(
      'div[data-id="youtube"][data-enabled="true"] div[data-indeterminate="false"][jsname="PE3haf"] input[type="checkbox"][jsname="YPqjbf"]',
      { delay: 2000 }
    );

    // Клікаєм на кнопку для вибора даних які хочем скачати
    await page.waitForSelector(
      `div[data-service="youtube"][data-is-transfer="false"] button[jsname="DNRMdf"]`
    );
    await page.click(
      `div[data-service="youtube"][data-is-transfer="false"] button[jsname="DNRMdf"]`,
      {
        delay: 3000,
      }
    );

    // Знімаємо всі галочки

    await page.waitForSelector(`button[jsname="Si7An"]`);
    await page.click(`button[jsname="Si7An"]`);

    await page.waitForTimeout(1000);

    // Ставимо галочку на історія
    await page.waitForSelector(`div[jsname="hr0Cke"] input[value="HISTORY"]`);
    await page.click(`div[jsname="hr0Cke"] input[value="HISTORY"]`, {
      delay: 1500,
    });

    // // Зробити паузу у 3 секунди
    await page.waitForTimeout(3000);

    // Натискаємо ОК
    await page.waitForSelector(
      'div[data-id="EBS5u"] span.NPEfkd.RveJvd.snByac'
    );
    await page.evaluate(() => {
      const okButton = document.querySelector(
        'div[data-id="EBS5u"] span.NPEfkd.RveJvd.snByac',
        {
          delay: 3500,
        }
      );
      okButton.click();
    });

    await page.waitForTimeout(1000);

    // Клікаємо на вибір формати
    await page.waitForSelector(
      'div[data-service="youtube"] button[jsname="cyPlw"]'
    );
    await page.click('div[data-service="youtube"] button[jsname="cyPlw"]', {
      delay: 2000,
    });

    // Кліл на HTML

    await page.waitForSelector(
      'div[jsname="jG2xZ"] div[jsname="LgbsSe"] div[jsname="d9BH4c"] div[data-value="text/html"]'
    );
    await page.click(
      'div[jsname="jG2xZ"] div[jsname="LgbsSe"] div[jsname="d9BH4c"] div[data-value="text/html"]'
    );
    await page.waitForTimeout(1000);

    // Перемикаємо на JSON

    await page.waitForSelector(
      'div[jsname="V68bde"] div[data-value="application/json"]'
    );
    await page.waitForTimeout(1500);
    await page.click('div[jsname="V68bde"] div[data-value="application/json"]');

    await page.waitForTimeout(3000);

    // Клік ОК
    await page.waitForSelector(
      'div[data-id="EBS5u"] span.NPEfkd.RveJvd.snByac'
    );
    await page.evaluate(() => {
      const okButton = document.querySelector(
        'div[data-id="EBS5u"] span.NPEfkd.RveJvd.snByac',
        {
          delay: 3500,
        }
      );
      okButton.click();
    });

    // Клік Наступний крок

    await page.waitForSelector('div[jsname="OCpkoe"] button[jsname="Pr7Yme"]');
    await page.waitForTimeout(2000); // wait for button to be fully loaded

    await page.click('div[jsname="OCpkoe"] button[jsname="Pr7Yme"]');

    // // Клік Експортувати дані

    const selector = 'div[class="OWKidf MAjs5"] div[jsname="mtisEf"]';
    await page.waitForSelector(selector);
    await page.click(selector);

    //  Робимо оновлення кожні 10с поки не появиться завантажити -> появляєть -> робимо клік (скачуємо) -> та зхакриваємо браузер
    await page.goto("https://takeout.google.com/takeout/downloads");

    const downloadButtonSelector =
      'td[class="jS7JJb y1qrSd schvPe"] a[jsname="hSRGPd"]';

    let downloadButtonExists = false;
    while (!downloadButtonExists) {
      await page.waitForTimeout(10000); // Refresh every 10 seconds
      await page.reload();

      try {
        await page.waitForSelector(downloadButtonSelector, { timeout: 1000 });
        downloadButtonExists = true;
      } catch (error) {
        console.log("Download button not found, refreshing...");
      }
    }

    await page.click(downloadButtonSelector);
    await page.waitForNavigation({ timeout: 60000 });
  } catch (error) {
    console.log(error);
  }
  // Close the browser after a short delay
  setTimeout(async () => {
    await browser.close();
  }, 10000);
}

module.exports = downloadGoogleData;
