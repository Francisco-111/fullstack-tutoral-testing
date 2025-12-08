const { runSingle, APP_URL, By, until } = require('./helpers.e2e');

runSingle('Required email', async (driver) => {
    await driver.get(APP_URL);

    const loginButton = await driver.findElement(
        By.xpath("//button[contains(., 'Log in')]")
    );
    await loginButton.click();

    await driver.sleep(1000);
    const tiles = await driver.findElements(By.css('[data-testid="launch-tile"]'));

    if (tiles.length > 0) {
        throw new Error('Empty email should not log in (launch tiles found).');
    }

    await driver.wait(
        until.elementLocated(By.css('[data-testid="login-input"]')),
        5000
    );
});
