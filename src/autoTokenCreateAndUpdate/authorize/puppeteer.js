const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

const getPuppeteerCode = async (authUrl) => {
  puppeteer.use(StealthPlugin());
  const browser = await puppeteer.launch({
    headless: false,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36"
  );
  const url = `${authUrl}`;
  await page.goto(url);

  await page.type("#identifierId", "andriykozh32@gmail.com");

  await page.click("#identifierNext");
  await page.waitForNavigation({ timeout: 60000 });

  await page.waitForSelector('input[name="Passwd"].whsOnd.zHQkBf', {
    visible: true,
  });
  await page.type('input[name="Passwd"].whsOnd.zHQkBf', "1311Max190716");

  await page.evaluate(() => {
    const nextButton = Array.from(document.querySelectorAll("button")).find(
      (button) => button.textContent.includes("Next")
    );
    if (nextButton) nextButton.click();
  });

  await page.waitForSelector(
    'div[jsname="QkNstf"] div[jsname="eBSUOb"] button'
  );
  await page.click('div[jsname="QkNstf"] div[jsname="eBSUOb"] button');

  await page.waitForSelector(
    'input[type="checkbox"][aria-labelledby="selectioni1"]'
  );
  await page.$eval(
    'input[type="checkbox"][aria-labelledby="selectioni1"]',
    (checkbox) => (checkbox.checked = true)
  );

  await page.waitForSelector(
    'input[type="checkbox"][aria-labelledby="selectioni2"]'
  );
  await page.$eval(
    'input[type="checkbox"][aria-labelledby="selectioni2"]',
    (checkbox) => (checkbox.checked = true)
  );

  await page.waitForSelector(
    'input[type="checkbox"][aria-labelledby="selectioni3"]'
  );
  await page.$eval(
    'input[type="checkbox"][aria-labelledby="selectioni3"]',
    (checkbox) => (checkbox.checked = true)
  );

  await page.waitForSelector(
    'input[type="checkbox"][aria-labelledby="selectioni4"]'
  );
  await page.$eval(
    'input[type="checkbox"][aria-labelledby="selectioni4"]',
    (checkbox) => (checkbox.checked = true)
  );

  await page.waitForSelector(
    'input[type="checkbox"][aria-labelledby="selectioni5"]'
  );
  await page.$eval(
    'input[type="checkbox"][aria-labelledby="selectioni5"]',
    (checkbox) => (checkbox.checked = true)
  );

  await page.waitForSelector(
    'input[type="checkbox"][aria-labelledby="selectioni6"]'
  );
  await page.$eval(
    'input[type="checkbox"][aria-labelledby="selectioni6"]',
    (checkbox) => (checkbox.checked = true)
  );

  await page.waitForSelector(
    'input[type="checkbox"][aria-labelledby="selectioni7"]'
  );
  await page.$eval(
    'input[type="checkbox"][aria-labelledby="selectioni7"]',
    (checkbox) => (checkbox.checked = true)
  );

  await page.waitForSelector('div[jsname="uRHG6"] button[jsname="LgbsSe"]');
  await page.waitForTimeout(2000); // Затримка 2000 мс (2 секунди)
  await page.click('div[jsname="uRHG6"] button[jsname="LgbsSe"]');

  // Wait for navigation after clicking "Next"
  await page.waitForNavigation({ timeout: 600000 });

  // Get URL from the current page
  const currentUrl = await page.evaluate(() => window.location.href);
  const input = currentUrl;

  const regex = /code=([^&]+)/;
  const match = input.match(regex);

  if (match && match[1]) {
    const codeValue = match[1];
    return codeValue;
  } else {
    console.log("Code not found in URL");
  }
  return null;
};

module.exports = { getPuppeteerCode };
