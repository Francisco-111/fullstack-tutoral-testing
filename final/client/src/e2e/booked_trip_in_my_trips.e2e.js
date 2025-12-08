const { runSingle, login, By, until } = require('./helpers.e2e');

runSingle('Booked trips visible in Profile', async (driver) => {
    await login(driver, 'test@test.com');
    await driver.sleep(500);

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
    await driver.sleep(800);

    const tripHeadings = await driver.findElements(By.css('h3'));
    const tripNames = [];

    for (const h of tripHeadings) {
        const text = await h.getText();
        if (text && text.trim().length > 0) {
            tripNames.push(text.trim());
        }
    }

    console.log(`Found ${tripNames.length} booked trip(s) in Profile:`);

    for (const name of tripNames) {
        console.log(`  - ${name}`);
    }

    if (tripNames.length === 0) {
        throw new Error('No booked trips found in Profile/My Trips.');
    }
});
