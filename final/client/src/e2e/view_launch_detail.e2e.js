const { runSingle, login, goToFirstLaunchDetail, By, until } = require('./helpers.e2e');

runSingle('View launch detail', async (driver) => {
    await login(driver, 'test@test.com');

    await goToFirstLaunchDetail(driver);

    const site = await driver.findElement(By.css('h5'));
    const rocketHeading = await driver.findElement(By.css('h3'));

    const siteText = await site.getText();
    const rocketText = await rocketHeading.getText();

    if (!siteText) throw new Error('Launch detail: site <h5> is empty.');
    if (!rocketText) throw new Error('Launch detail: rocket <h3> is empty.');
});
