const { runSingle, login, goToLaunchList, By, until } = require('./helpers.e2e');

runSingle('Book launch via cart and verify in profile', async (driver) => {
    await login(driver, 'test@test.com');
    await driver.sleep(500);

    await goToLaunchList(driver);
    await driver.sleep(500);

    const headings = await driver.findElements(By.css('h3'));
    const firstHeading = headings[0];
    if (!firstHeading) {
        throw new Error('No launch heading found to click.');
    }

    const missionName = await firstHeading.getText();
    console.log(`Selected mission: ${missionName}`);

    await firstHeading.click();
    await driver.wait(until.elementsLocated(By.css('h5')), 10000);
    await driver.sleep(500);

    const addToCartButton = await driver.findElement(
        By.xpath("//button[contains(., 'Add to Cart')]")
    );
    await addToCartButton.click();
    await driver.sleep(800);

    const cartLink = await driver.findElement(
        By.xpath("//a[contains(., 'Cart')]")
    );
    await cartLink.click();
    await driver.wait(
        until.elementLocated(By.xpath("//*[contains(., 'Cart')]")),
        10000
    );
    await driver.sleep(800);

    const bookAllButton = await driver.findElement(
        By.xpath("//button[contains(., 'Book All')]")
    );
    await bookAllButton.click();
    await driver.sleep(1000);

    const profileLink = await driver.findElement(
        By.xpath("//a[contains(., 'Profile')]")
    );
    await profileLink.click();
    await driver.wait(
        until.elementLocated(
            By.xpath("//*[contains(., 'Profile') or contains(., 'My Trips')]")
        ),
        10000
    );
    await driver.sleep(800);

    const bodyText = await driver.findElement(By.css('body')).getText();
    if (!bodyText.includes(missionName)) {
        throw new Error(
            `Expected mission "${missionName}" to appear in Profile/My Trips, but it was not found.`
        );
    }

    console.log(`Verified mission "${missionName}" appears in Profile/My Trips.`);
});
