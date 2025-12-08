const { runSingle, login, goToLaunchList, APP_URL, By, until } = require('./helpers.e2e');

runSingle('Refresh during common flows does not break app', async (driver) => {
    await login(driver, 'test@test.com');
    await driver.sleep(500);

    await goToLaunchList(driver);
    await driver.sleep(500);

    console.log('Refreshing on launch list...');
    await driver.navigate().refresh();

    await driver.wait(
        until.elementsLocated(By.css('h3')),
        10000
    );
    console.log('Launch list still visible after refresh.');
    await driver.sleep(500);

    const headings = await driver.findElements(By.css('h3'));
    if (!headings.length) {
        throw new Error('No launches available to open detail for refresh test.');
    }

    const heading = headings[0];
    const missionName = (await heading.getText()).trim();
    console.log(`Opening detail for mission: ${missionName}`);

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

    console.log('Refreshing on launch detail page...');
    await driver.navigate().refresh();

    await driver.wait(
        until.elementsLocated(By.css('h5')),
        10000
    );
    await driver.sleep(500);

    const bodyText = await driver.findElement(By.css('body')).getText();
    if (!bodyText || bodyText.trim().length === 0) {
        throw new Error('Page became blank after refresh on detail.');
    }

    console.log('Detail page still rendered after refresh.');

    const homeLinks = await driver.findElements(
        By.xpath("//a[contains(., 'Home') or contains(., 'Launches')]")
    );
    if (homeLinks.length) {
        await homeLinks[0].click();
        await driver.wait(
            until.elementsLocated(By.css('h3')),
            10000
        );
        console.log('Navigation still works after refreshes.');
    }
});
