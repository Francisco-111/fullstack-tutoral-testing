const { runSingle, login, By, until } = require('./helpers.e2e');

runSingle('Token stored in localStorage and survives refresh', async (driver) => {
    await login(driver, 'test@test.com');
    await driver.sleep(500);

    const token = await driver.executeScript(
        'return window.localStorage.getItem("token");'
    );

    if (!token) {
        throw new Error('No token found in localStorage after login.');
    }

    console.log(`Token stored in localStorage (length=${token.length}).`);

    await driver.navigate().refresh();

    await driver.wait(
        until.elementLocated(By.css('h2')),
        10000
    );
    await driver.sleep(500);

    const loginInputs = await driver.findElements(
        By.css('[data-testid="login-input"]')
    );
    if (loginInputs.length > 0) {
        throw new Error('Login input visible after refresh; user not treated as logged in.');
    }

    const header = await driver.findElement(By.css('h2'));
    const headerText = await header.getText();
    console.log(`Header after refresh: ${headerText}`);

    console.log('Token is present and session survived refresh.');
});
