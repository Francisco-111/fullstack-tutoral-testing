const { runSingle, login, goToLaunchList, By, until } = require('./helpers.e2e');

runSingle('Launch tile keyboard access', async (driver) => {
    await login(driver);
    await goToLaunchList(driver);

    const headings = await driver.findElements(By.css('h3'));
    const firstHeading = headings[0];

    if (!firstHeading) throw new Error('No launch heading to test keyboard access.');

    await driver.executeScript('arguments[0].focus();', firstHeading);
    await driver.actions().sendKeys('\uE007').perform();

    await driver.wait(
        until.elementsLocated(By.css('h5')),
        10000
    );
});
