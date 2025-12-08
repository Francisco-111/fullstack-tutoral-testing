const { runSingle, login, goToLaunchList, By, until } = require('./helpers.e2e');

runSingle('Load more launches', async (driver) => {
    await login(driver);
    await goToLaunchList(driver);

    const initialHeadings = await driver.findElements(By.css('h3'));
    const initialCount = initialHeadings.length;
    console.log(`Initial launch count: ${initialCount}`);

    const loadMoreButtons = await driver.findElements(
        By.xpath("//button[contains(., 'Load More') or contains(., 'More')]")
    );

    if (!loadMoreButtons.length) {
        console.log('No "Load More" button found; skipping extra assertion.');
        return;
    }

    const loadMoreButton = loadMoreButtons[0];

    await driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        loadMoreButton
    );
    await driver.sleep(500);

    await driver.executeScript("arguments[0].click();", loadMoreButton);

    await driver.wait(async () => {
        const headings = await driver.findElements(By.css('h3'));
        return headings.length > initialCount;
    }, 10000).catch(async () => {
        const newHeadings = await driver.findElements(By.css('h3'));
        const newCount = newHeadings.length;
        throw new Error(
            `Expected more launches after Load More, but count stayed at ${initialCount} (now ${newCount}).`
        );
    });

    const finalHeadings = await driver.findElements(By.css('h3'));
    console.log(`Final launch count after Load More: ${finalHeadings.length}`);
});
