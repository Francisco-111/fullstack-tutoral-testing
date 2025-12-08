const { runSingle, login, By, until } = require('./helpers.e2e');

runSingle('Successful login', async (driver) => {
    await login(driver, 'test@test.com');
    const header = await driver.wait(until.elementLocated(By.css('h2')), 10000);
    const text = (await header.getText()).toLowerCase();
    if (!text.includes('space explorer') && !text.includes('launch')) {
        throw new Error(`Unexpected header after login: ${text}`);
    }
});
