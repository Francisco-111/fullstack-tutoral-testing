const { runSingle, login, goToLaunchList, APP_URL, By, until } = require('./helpers.e2e');

runSingle('Cart persists after navigation', async (driver) => {
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
    console.log(`Adding mission to cart for persistence test: ${missionName}`);

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
            `Mission "${missionName}" not found in Cart after initial add.`
        );
    }

    console.log('Mission present in Cart, now navigating away...');

    const homeLinks = await driver.findElements(
        By.xpath("//a[contains(., 'Home') or contains(., 'Launches')]")
    );
    if (homeLinks.length) {
        await homeLinks[0].click();
    } else {
        await driver.get(APP_URL);
    }

    await driver.wait(
        until.elementsLocated(By.css('h3')),
        10000
    );
    await driver.sleep(700);

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
    if (!bodyText.includes(missionName)) {
        throw new Error(
            `Mission "${missionName}" was not persisted in Cart across navigation.`
        );
    }

    console.log(`Mission "${missionName}" still present in Cart after navigation.`);
});
