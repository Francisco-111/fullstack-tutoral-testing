const { runSingle, login, By, until } = require('./helpers.e2e');

runSingle('Launch list has items', async (driver) => {
    await login(driver, 'test@test.com');

    let headings;
    try {
        headings = await driver.wait(
            until.elementsLocated(By.css('h3')),
            10000
        );
    } catch (e) {
        const bodyText = await driver.findElement(By.css('body')).getText();
        throw new Error(
            `Did not find any <h3> elements (potential launch headings).\n` +
            `Page text was:\n${bodyText.slice(0, 400)}...`
        );
    }

    if (!headings || headings.length === 0) {
        throw new Error('No launch headings found on the page.');
    }

    console.log(`Found ${headings.length} launch heading(s).`);
});
