const { runSingle, login, By, until } = require('./helpers.e2e');

runSingle('Logout clears token and returns to login', async (driver) => {
    await login(driver, 'test@test.com');
    await driver.sleep(500);

    let token = await driver.executeScript(
        'return window.localStorage.getItem("token");'
    );
    if (!token) {
        throw new Error('Token not found in localStorage before logout.');
    }
    console.log(`Token before logout (length=${token.length}).`);

    const logoutButtons = await driver.findElements(
        By.xpath("//button[contains(., 'Logout') or contains(., 'Log out')]")
    );

    if (!logoutButtons.length) {
        throw new Error('Logout button not found in header.');
    }

    const logoutButton = logoutButtons[0];

    await driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        logoutButton
    );
    await driver.sleep(300);
    await driver.executeScript("arguments[0].click();", logoutButton);

    await driver.wait(
        until.elementLocated(By.css('[data-testid=\"login-input\"]')),
        10000
    );
    await driver.sleep(500);

    token = await driver.executeScript(
        'return window.localStorage.getItem("token");'
    );
    if (token) {
        throw new Error('Token still present in localStorage after logout.');
    }

    console.log('Token cleared from localStorage and login form visible again after logout.');
});
