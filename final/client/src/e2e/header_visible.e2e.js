const { runSingle, login, goToLaunchList, By } = require('./helpers.e2e');

runSingle('Header visible on launches', async (driver) => {
    await login(driver);
    await goToLaunchList(driver);

    const header = await driver.findElement(By.css('h2'));
    const text = await header.getText();

    if (!text) throw new Error('Header <h2> is empty.');
    console.log(`Header text: ${text}`);
});
