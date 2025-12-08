const { runSingle, login, By, until } = require('./helpers.e2e');

runSingle('Empty My Trips by canceling all trips', async (driver) => {
    await login(driver, 'test@test.com');
    await driver.sleep(500);

    const goToProfile = async () => {
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
        await driver.sleep(600);
    };

    await goToProfile();

    while (true) {
        // Find all trip headings (<h3> in Profile/My Trips)
        let tripHeadings = await driver.findElements(By.css('h3'));
        tripHeadings = tripHeadings.filter(async (el) => {
            const txt = (await el.getText()) || '';
            return txt.trim().length > 0;
        });

        const headingsRaw = await driver.findElements(By.css('h3'));
        const tripNames = [];
        for (const h of headingsRaw) {
            const t = (await h.getText()).trim();
            if (t) tripNames.push(t);
        }

        if (tripNames.length === 0) {
            console.log('No trips left in Profile/My Trips.');
            break;
        }

        console.log(`Current trips (${tripNames.length}):`);
        for (const n of tripNames) console.log('  - ' + n);

        const headingEl = headingsRaw[0];
        const tripName = tripNames[0];

        console.log(`Cancelling trip: ${tripName}`);

        await driver.executeScript(
            "arguments[0].scrollIntoView({block:'center'});",
            headingEl
        );
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", headingEl);

        await driver.wait(
            until.elementsLocated(By.css('h5')),
            10000
        );
        await driver.sleep(500);

        const cancelButtons = await driver.findElements(
            By.xpath("//button[contains(., 'Cancel')]")
        );
        if (!cancelButtons.length) {
            throw new Error(
                `Could not find a "Cancel" button on detail page for trip "${tripName}".`
            );
        }

        const cancelButton = cancelButtons[0];

        await driver.executeScript(
            "arguments[0].scrollIntoView({block:'center'});",
            cancelButton
        );
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", cancelButton);
        await driver.sleep(800);

        await driver.findElements(
            By.xpath("//button[contains(., 'Book')]")
        ).catch(() => {});

        await goToProfile();
    }
});
