const { runSingle, APP_URL, By, until } = require('./helpers.e2e');

runSingle('Book requires authentication', async (driver) => {
    await driver.get(APP_URL);
    await driver.executeScript('window.localStorage.removeItem("token");');
    await driver.navigate().refresh();

    const loginInput = await driver.wait(
        until.elementLocated(By.css('[data-testid="login-input"]')),
        10000
    );
    if (!loginInput) {
        throw new Error('Login input not visible while unauthenticated.');
    }

    await driver.get(APP_URL);
    await driver.sleep(500);

    const bookButtons = await driver.findElements(
        By.xpath("//button[contains(., 'Book') or contains(., 'Add to Cart')]")
    );

    if (bookButtons.length > 0) {
        throw new Error(
            'Found Book/Add to Cart buttons while unauthenticated; booking should require auth.'
        );
    }

    console.log('Unauthenticated user sees login and no booking controls.');
});
