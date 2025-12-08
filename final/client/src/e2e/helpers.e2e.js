const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
require('chromedriver');

const APP_URL = 'http://localhost:3000';

async function buildDriver() {
    const options = new chrome.Options()
        .addArguments('--log-level=3')
        .addArguments('--disable-logging')
        .excludeSwitches(['enable-logging']);
    return new Builder().forBrowser('chrome').setChromeOptions(options).build();
}

async function login(driver, email = 'test@test.com') {
    await driver.get(APP_URL);

    const input = await driver.wait(
        until.elementLocated(By.css('[data-testid="login-input"]')),
        10000
    );
    await input.sendKeys(email);

    const loginBtn = await driver.findElement(
        By.xpath("//button[contains(., 'Log in')]")
    );
    await loginBtn.click();

    await driver.wait(
        until.elementLocated(By.css('h2')),
        10000
    );

    await driver.navigate().refresh();

    await driver.wait(
        until.elementsLocated(By.css('h2')),
        10000
    );

    await driver.sleep(500);
}


async function goToLaunchList(driver) {
    await driver.wait(
        until.elementsLocated(By.css('h3')),
        10000
    );
}

async function goToFirstLaunchDetail(driver) {
    await goToLaunchList(driver);

    const headings = await driver.findElements(By.css('h3'));
    const firstHeading = headings[0];

    if (!firstHeading) {
        throw new Error('No launch heading found to click.');
    }

    await firstHeading.click();

    await driver.wait(
        until.elementsLocated(By.css('h5')),
        10000
    );
}

async function goToMyTrips(driver) {
    const myTripsLink = await driver.findElement(
        By.xpath("//a[contains(., 'My Trips')]")
    );
    await myTripsLink.click();

    await driver.wait(
        until.elementLocated(By.xpath("//*[contains(., 'My Trips')]")),
        10000
    );
}

async function runSingle(name, fn) {
    console.log(`\n=== ${name} ===`);
    const driver = await buildDriver();
    try {
        await fn(driver);
        console.log(`✅ ${name} PASSED`);
    } catch (err) {
        console.error(`❌ ${name} FAILED`, err.message || err);
        process.exitCode = 1;
    } finally {
        await driver.quit();
        console.log('✔ WebDriver quit');
    }
}

module.exports = {
    APP_URL,
    buildDriver,
    login,
    goToLaunchList,
    goToFirstLaunchDetail,
    goToMyTrips,
    runSingle,
    By,
    until,
};
