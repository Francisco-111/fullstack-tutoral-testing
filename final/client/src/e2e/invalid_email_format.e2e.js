const { runSingle, APP_URL, By, until } = require('./helpers.e2e');

runSingle('Invalid email format', async (driver) => {
    await driver.get(APP_URL);

    const emailInput = await driver.wait(
        until.elementLocated(By.css('[data-testid="login-input"]')),
        10000
    );
    await emailInput.clear();
    await emailInput.sendKeys('not-an-email');

    const loginButton = await driver.findElement(
        By.xpath("//button[contains(., 'Log in')]")
    );
    await loginButton.click();

    await driver.sleep(1000);
    const tiles = await driver.findElements(By.css('[data-testid="launch-tile"]'));
    if (tiles.length > 0) {
        throw new Error('Invalid email format should not log in.');
    }
});
