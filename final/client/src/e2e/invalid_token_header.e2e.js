const { runSingle, APP_URL, By, until } = require('./helpers.e2e');

runSingle('Invalid token in localStorage does not break app', async (driver) => {
    await driver.get(APP_URL);
    await driver.executeScript(
        'window.localStorage.setItem("token", "not-base64-token!!");'
    );

    await driver.navigate().refresh();

    await driver.wait(
        until.elementLocated(By.css('body')),
        10000
    );
    await driver.sleep(500);

    const bodyText = await driver.findElement(By.css('body')).getText();
    if (!bodyText || bodyText.trim().length === 0) {
        throw new Error('Page appears blank with invalid token; app likely crashed.');
    }

    console.log('Non-empty body with invalid token; app handled invalid token without hard crash.');

    const loginInputs = await driver.findElements(
        By.css('[data-testid="login-input"]')
    );
    if (loginInputs.length) {
        console.log('Login form visible with invalid token, which is acceptable behavior.');
    } else {
        console.log('No login form, but page still rendered fine.');
    }
});
