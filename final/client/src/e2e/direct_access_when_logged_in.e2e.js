const { runSingle, login, APP_URL, By, until } = require('./helpers.e2e');

runSingle('Direct access when logged in', async (driver) => {
    await login(driver);
    await driver.wait(until.elementLocated(By.css('h2')), 10000);

    await driver.get(APP_URL);

    const header = await driver.wait(until.elementLocated(By.css('h2')), 10000);
    const text = (await header.getText()).toLowerCase();
    if (!text.includes('space explorer') && !text.includes('launch')) {
        throw new Error('User not auto-redirected to main page when logged in.');
    }
});
