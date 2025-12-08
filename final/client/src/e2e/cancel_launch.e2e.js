const { runSingle, login, By, until } = require('./helpers.e2e');

runSingle('Cancel Trip from Profile', async (driver) => {
    await login(driver, 'test@test.com');
    await driver.sleep(500);

    const profileLink = await driver.findElement(
        By.xpath("//a[contains(., 'Profile')]")
    );
    await profileLink.click();

    await driver.wait(
        until.elementLocated(By.xpath("//*[contains(., 'Profile') or contains(., 'My Trips')]")),
        10000
    );
    await driver.sleep(600);

    let tripHeadings = await driver.findElements(By.css("h3"));

    if (tripHeadings.length === 0) {
        throw new Error("No trips found in Profile — cannot cancel a trip.");
    }

    const firstTrip = tripHeadings[0];
    const tripName = await firstTrip.getText();
    console.log(`Found booked trip: ${tripName}`);

    await firstTrip.click();

    await driver.wait(
        until.elementsLocated(By.css("h5")),
        10000
    );
    await driver.sleep(600);

    let cancelButton = await driver.findElement(
        By.xpath("//button[contains(., 'Cancel')]")
    );

    await cancelButton.click();
    await driver.sleep(800);

    const profileLink2 = await driver.findElement(
        By.xpath("//a[contains(., 'Profile')]")
    );
    await profileLink2.click();

    await driver.wait(
        until.elementLocated(By.xpath("//*[contains(., 'Profile') or contains(., 'My Trips')]")),
        10000
    );
    await driver.sleep(600);

    const updatedHeadings = await driver.findElements(By.css("h3"));
    const updatedNames = [];

    for (const h of updatedHeadings) {
        updatedNames.push(await h.getText());
    }

    if (updatedNames.some(name => name.includes(tripName))) {
        throw new Error(`Trip "${tripName}" still appears after cancellation.`);
    }

    console.log(`Success: Trip "${tripName}" was cancelled and removed from Profile.`);
});
