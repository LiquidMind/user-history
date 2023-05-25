const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const clipboardy = require("clipboardy");
const fs = require("fs");
const { db } = require("../../model/dbConnection");

puppeteer.use(StealthPlugin());
async function downloadGoogleData(email, password) {
  let updateSuccessful = false;

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
    await page.goto("https://console.cloud.google.com/apis/credentials");

    await page.type("#identifierId", `${email}`);

    await page.click("#identifierNext");
    await page.waitForNavigation({ timeout: 10000 });

    await page.waitForSelector('input[name="Passwd"].whsOnd.zHQkBf', {
      visible: true,
    });
    await page.type('input[name="Passwd"].whsOnd.zHQkBf', `${password}`);

    await page.evaluate(() => {
      const nextButton = Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent.includes("Next")
      );
      if (nextButton) nextButton.click();
    });

    try {
      await page.waitForSelector(
        'div[class="mdc-checkbox"] input[id="mat-mdc-checkbox-2-input"]'
      );
      await page.click(
        'div[class="mdc-checkbox"] input[id="mat-mdc-checkbox-2-input"]'
      );
    } catch (error) {
      console.log(error);
    }

    try {
      await page.waitForSelector(
        'mat-dialog-actions[class="mat-dialog-actions"] button[mat-button-is-fab="false"]'
      );
      await page.click(
        'mat-dialog-actions[class="mat-dialog-actions"] button[mat-button-is-fab="false"]',
        { delay: 1000 }
      );
    } catch (error) {
      console.log(error);
    }

    try {
      await page.waitForSelector(
        'div[class="cfc-message-text-actions-section"] div[class="ng-star-inserted"] button[mat-button-is-fab="false"]'
      );
      await page.waitForTimeout(3000); // збільшити затримку перед натисканням кнопки
      await page.click(
        'div[class="cfc-message-text-actions-section"] div[class="ng-star-inserted"] button[mat-button-is-fab="false"]'
      );
    } catch (error) {
      console.log(error);
    }
    try {
      await page.waitForSelector(
        "button.projtest-create-form-submit.mdc-button.mdc-button--raised.mat-mdc-raised-button.mat-primary.mat-mdc-button-base.gmat-mdc-button.cm-button"
      );
      await page.waitForTimeout(3000); // збільшити затримку перед натисканням кнопки

      await page.click(
        "button.projtest-create-form-submit.mdc-button.mdc-button--raised.mat-mdc-raised-button.mat-primary.mat-mdc-button-base.gmat-mdc-button.cm-button"
      );
    } catch (error) {
      console.log(error);
    }

    await page.reload();

    try {
      await page.waitForSelector(
        'button[cfccalloutsteptarget="credential-create-button"]'
      );
      await page.waitForTimeout(3000); // збільшити затримку перед натисканням кнопки

      await page.click(
        'button[cfccalloutsteptarget="credential-create-button"]'
      );
    } catch (error) {
      console.log(error);
    }

    try {
      await page.waitForSelector(
        'div[class="cfc-menu-item-col ng-star-inserted"]'
      );

      await page.click('div[class="cfc-menu-item-col ng-star-inserted"]');
    } catch (error) {
      console.log(error);
    }

    try {
      await page.waitForSelector(
        'div[class="cfc-code-snippet-copy"] button[aria-label="Copy key"]'
      );
      await page.click(
        'div[class="cfc-code-snippet-copy"] button[aria-label="Copy key"]'
      );
    } catch (error) {
      console.log(error);
    }

    // Чекаємо невеликий проміжок часу, щоб дозволити браузеру скопіювати текст в буфер обміну
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Зчитуємо текст з буфера обміну
    const clipboardContents = await clipboardy.read();

    let data = [];
    // Спробуємо зчитати вміст файлу, якщо він існує
    try {
      const fileContents = fs.readFileSync("data.json");
      data = JSON.parse(fileContents);
    } catch (err) {
      console.log(
        "File does not exist or is not readable, starting with an empty array."
      );
    }

    // Додаємо новий вміст буфера обміну до масиву
    data.push(clipboardContents);

    // Записуємо вміст буфера обміну в файл
    fs.writeFileSync("data.json", JSON.stringify(data, null, 2));

    // Оновлення успішно виконано
    updateSuccessful = true;
  } catch (err) {
    console.error("Не вдалося завантажити дані з Google: ", err);
  } finally {
    // Закриваємо браузер незалежно від того, чи була помилка, чи ні
    await browser.close();
  }

  // Повертаємо значення, чи було оновлення успішним
  return updateSuccessful;
}

module.exports = downloadGoogleData;
