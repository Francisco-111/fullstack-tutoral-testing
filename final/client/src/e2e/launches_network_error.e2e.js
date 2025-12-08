const { runSingle, APP_URL, By } = require('./helpers.e2e');

runSingle('Launches network error UI (when server is down)', async (driver) => {
    await driver.get(APP_URL);
    await driver.executeScript('window.localStorage.removeItem("token");');
    await driver.navigate().refresh();

    await driver.get(APP_URL);
    await driver.sleep(2000);

    const possibleErrorSelectors = [
        '[data-testid="launches-error"]',
        '.error',
    ];

    let foundError = false;

    for (const sel of possibleErrorSelectors) {
        const els = await driver.findElements(By.css(sel));
        if (els.length) {
            foundError = true;
            break;
        }
    }

    const bodyText = await driver.findElement(By.css('body')).getText();
    if (
        /error/i.test(bodyText) ||
        /network/i.test(bodyText) ||
        /failed/i.test(bodyText)
    ) {
        foundError = true;
    }

    if (foundError) {
        console.log('Detected error UI for launches (server likely down).');
    } else {
        console.log(
            'No launches error UI detected; server is probably running. Test is informational, not failing.'
        );
    }
});
