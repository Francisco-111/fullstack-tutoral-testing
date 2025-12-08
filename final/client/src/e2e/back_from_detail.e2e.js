const { runSingle, login, goToFirstLaunchDetail, goToLaunchList, By, until } = require('./helpers.e2e');

runSingle('Back from launch detail', async (driver) => {
    await login(driver);
    await goToFirstLaunchDetail(driver);

    await driver.navigate().back();

    await driver.wait(
        until.elementsLocated(By.css('h3')),
        10000
    );

    const headings = await driver.findElements(By.css('h3'));
    if (!headings.length) {
        throw new Error('After navigating back, no launch headings were found.');
    }
});
