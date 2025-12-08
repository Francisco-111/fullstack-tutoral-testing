const { runSingle, login, goToLaunchList, APP_URL, By, until } = require('./helpers.e2e');

runSingle('Cart clears on logout', async (driver) => {
    await login(driver, 'test@test.com');
    await driver.sleep(500);

    await goToLaunchList(driver);
    await driver.sleep(500);

    const headings = await driver.findElements(By.css('h3'));
    if (!headings.length) {
        throw new Error('No launches found on launch list.');
    }

    const heading = headings[0];
    const missionName = (await heading.getText()).trim();
    console.log(`Adding mission to cart before logout: ${missionName}`);

    await driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        heading
    );
    await driver.sleep(300);
    await driver.executeScript("arguments[0].click();", heading);

    await driver.wait(
        until.elementsLocated(By.css('h5')),
        10000
    );
    await driver.sleep(500);

    const addToCartButtons = await driver.findElements(
        By.xpath("//button[contains(., 'Add to Cart')]")
    );
    if (!addToCartButtons.length) {
        throw new Error('Add to Cart button not found on launch detail page.');
    }
    await addToCartButtons[0].click();
    await driver.sleep(700);

    const cartLink = await driver.findElement(
        By.xpath("//a[contains(., 'Cart')]")
    );
    await cartLink.click();

    await driver.wait(
        until.elementLocated(By.xpath("//*[contains(., 'Cart')]")),
        10000
    );
    await driver.sleep(700);

    let bodyText = await driver.findElement(By.css('body')).getText();
    if (!bodyText.includes(missionName)) {
        throw new Error(
            `Expected mission "${missionName}" to appear in Cart before logout, but it was not found.`
        );
    }
    console.log(`Mission "${missionName}" is present in Cart before logout.`);

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
        until.elementLocated(By.css('[data-testid="login-input"]')),
        10000
    );
    await driver.sleep(500);

    await login(driver, 'test@test.com');
    await driver.sleep(500);

    const cartLink2 = await driver.findElement(
        By.xpath("//a[contains(., 'Cart')]")
    );
    await cartLink2.click();

    await driver.wait(
        until.elementLocated(By.xpath("//*[contains(., 'Cart')]")),
        10000
    );
    await driver.sleep(700);

    bodyText = await driver.findElement(By.css('body')).getText();

    if (bodyText.includes(missionName)) {
        throw new Error(
            `Mission "${missionName}" is still in Cart after logout/login; cart did not clear.`
        );
    }

    console.log(
        `Success: Cart no longer contains "${missionName}" after logout and new login.`
    );
});
