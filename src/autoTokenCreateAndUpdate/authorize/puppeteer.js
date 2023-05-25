// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");

// const getPuppeteerCode = async (authUrl, email, password) => {
//   puppeteer.use(StealthPlugin());
//   const browser = await puppeteer.launch({
//     headless: false,
//     executablePath:
//       "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
//   });
//   const page = await browser.newPage();
//   await page.setUserAgent(
//     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
//   );

//   const url = `${authUrl}`;
//   await page.goto(url);

//   await page.type("#identifierId", `${email}`);

//   await page.click("#identifierNext");
//   await page.waitForNavigation({ timeout: 10000 });

//   await page.waitForSelector('input[name="Passwd"].whsOnd.zHQkBf', {
//     visible: true,
//   });
//   await page.type('input[name="Passwd"].whsOnd.zHQkBf', `${password}`);

//   await page.evaluate(() => {
//     const nextButton = Array.from(document.querySelectorAll("button")).find(
//       (button) => button.textContent.includes("Next")
//     );
//     if (nextButton) nextButton.click();
//   });

//   // await page.waitForSelector(
//   //   'div[jsname="QkNstf"] div[jsname="eBSUOb"] button'
//   // );
//   // await page.click('div[jsname="QkNstf"] div[jsname="eBSUOb"] button');

//   // await page.waitForSelector(
//   //   'input[type="checkbox"][aria-labelledby="selectioni1"]'
//   // );
//   // await page.$eval(
//   //   'input[type="checkbox"][aria-labelledby="selectioni1"]',
//   //   (checkbox) => (checkbox.checked = true)
//   // );

//   // await page.waitForSelector(
//   //   'input[type="checkbox"][aria-labelledby="selectioni2"]'
//   // );
//   // await page.$eval(
//   //   'input[type="checkbox"][aria-labelledby="selectioni2"]',
//   //   (checkbox) => (checkbox.checked = true)
//   // );

//   // await page.waitForSelector(
//   //   'input[type="checkbox"][aria-labelledby="selectioni3"]'
//   // );
//   // await page.$eval(
//   //   'input[type="checkbox"][aria-labelledby="selectioni3"]',
//   //   (checkbox) => (checkbox.checked = true)
//   // );

//   // await page.waitForSelector(
//   //   'input[type="checkbox"][aria-labelledby="selectioni4"]'
//   // );
//   // await page.$eval(
//   //   'input[type="checkbox"][aria-labelledby="selectioni4"]',
//   //   (checkbox) => (checkbox.checked = true)
//   // );

//   // await page.waitForSelector(
//   //   'input[type="checkbox"][aria-labelledby="selectioni5"]'
//   // );
//   // await page.$eval(
//   //   'input[type="checkbox"][aria-labelledby="selectioni5"]',
//   //   (checkbox) => (checkbox.checked = true)
//   // );

//   // await page.waitForSelector(
//   //   'input[type="checkbox"][aria-labelledby="selectioni6"]'
//   // );
//   // await page.$eval(
//   //   'input[type="checkbox"][aria-labelledby="selectioni6"]',
//   //   (checkbox) => (checkbox.checked = true)
//   // );

//   // await page.waitForSelector(
//   //   'input[type="checkbox"][aria-labelledby="selectioni7"]'
//   // );
//   // await page.$eval(
//   //   'input[type="checkbox"][aria-labelledby="selectioni7"]',
//   //   (checkbox) => (checkbox.checked = true)
//   // );

//   // await page.waitForSelector('div[jsname="uRHG6"] button[jsname="LgbsSe"]');
//   // await page.waitForTimeout(2000); // Затримка 2000 мс (2 секунди)
//   // await page.click('div[jsname="uRHG6"] button[jsname="LgbsSe"]');

//   // Wait for navigation after clicking "Next"
//   await page.waitForNavigation({ timeout: 10000 });

//   // Get URL from the current page
//   const currentUrl = await page.evaluate(() => window.location.href);
//   const input = currentUrl;
//   const regex = /code=([^&]+)/;
//   const match = input.match(regex);

//   if (match && match[1]) {
//     const codeValue = match[1];
//     setTimeout(async () => {
//       await browser.close();
//     }, 5000);
//     return codeValue;
//   } else {
//     console.log("Code not found in URL");
//   }

//   setTimeout(async () => {
//     await browser.close();
//   }, 5000);
// };

// module.exports = { getPuppeteerCode };

const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const getPuppeteerCode = async (authUrl, email, password) => {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
    );

    const url = `${authUrl}`;
    await page.goto(url);

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
        'div[jsname="QkNstf"] div[jsname="eBSUOb"] button'
      );
      await page.click('div[jsname="QkNstf"] div[jsname="eBSUOb"] button');
    } catch (error) {
      console.log(error);
    }

    try {
      await page.waitForSelector(
        'input[type="checkbox"][aria-labelledby="selectioni1"]'
      );
      await page.click('input[type="checkbox"][aria-labelledby="selectioni1"]');
    } catch (error) {
      console.error("Error occurred in block 1:", error);
    }

    try {
      await page.waitForSelector(
        'input[type="checkbox"][aria-labelledby="selectioni2"]'
      );
      await page.click('input[type="checkbox"][aria-labelledby="selectioni2"]');
    } catch (error) {
      console.error("Error occurred in block 2:", error);
    }

    try {
      await page.waitForSelector(
        'input[type="checkbox"][aria-labelledby="selectioni3"]'
      );
      await page.click('input[type="checkbox"][aria-labelledby="selectioni3"]');
    } catch (error) {
      console.error("Error occurred in block 3:", error);
    }

    try {
      await page.waitForSelector(
        'input[type="checkbox"][aria-labelledby="selectioni4"]'
      );
      await page.click('input[type="checkbox"][aria-labelledby="selectioni4"]');
    } catch (error) {
      console.error("Error occurred in block 4:", error);
    }

    try {
      await page.waitForSelector(
        'input[type="checkbox"][aria-labelledby="selectioni5"]'
      );
      await page.click('input[type="checkbox"][aria-labelledby="selectioni5"]');
    } catch (error) {
      console.error("Error occurred in block 5:", error);
    }

    try {
      await page.waitForSelector(
        'input[type="checkbox"][aria-labelledby="selectioni6"]'
      );
      await page.click('input[type="checkbox"][aria-labelledby="selectioni6"]');
    } catch (error) {
      console.error("Error occurred in block 6:", error);
    }

    try {
      await page.waitForSelector(
        'input[type="checkbox"][aria-labelledby="selectioni7"]'
      );
      await page.click('input[type="checkbox"][aria-labelledby="selectioni7"]');
    } catch (error) {
      console.error("Error occurred in block 7:", error);
    }

    try {
      await page.waitForSelector(
        'input[type="checkbox"][aria-labelledby="selectioni8"]'
      );
      await page.click('input[type="checkbox"][aria-labelledby="selectioni8"]');
    } catch (error) {
      console.error("Error occurred in block 8:", error);
    }

    try {
      await page.waitForSelector('div[jsname="uRHG6"] button[jsname="LgbsSe"]');
      await page.waitForTimeout(5000); // Затримка 5000 мс (5 секунд)
      const navigationPromise = page.waitForNavigation(); // Set up a promise to wait for navigation
      await page.click('div[jsname="uRHG6"] button[jsname="LgbsSe"]');
      await navigationPromise; // Wait for navigation to finish
    } catch (error) {
      console.error("Error occurred continue button", error);
    }

    // Now currentUrl will be evaluated after navigation
    const currentUrl = await page.evaluate(() => window.location.href);
    console.log(`ONE ${currentUrl}`);
    if (currentUrl.includes("login-error")) {
      console.log("Invalid email or password");
      throw new Error("Invalid email or password");
    }
    console.log(`TWO ${currentUrl}`);

    // Get code from URL if present
    const regex = /code=([^&]+)/;
    const match = currentUrl.match(regex);

    console.log(`THREE ${match}`);

    const codeValue = match[1];
    console.log(codeValue);
    console.log(`FOUR ${codeValue}`);

    return codeValue;

    await page.waitForNavigation({ timeout: 60000 });
  } catch (error) {
    console.log("An error occurred:", error);
    throw error;
  } finally {
    await browser.close();
  }
};

module.exports = { getPuppeteerCode };
