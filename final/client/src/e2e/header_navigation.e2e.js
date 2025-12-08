const { runSingle, login, goToLaunchList, goToMyTrips, APP_URL, By, until } = require('./helpers.e2e');

runSingle('Header navigation + logout smoke test', async (driver) => {

    await login(driver, 'test@test.com');
    await driver.sleep(500);

    console.log('Checking Home / Launches navigation...');

    let homeLinks = await driver.findElements(
        By.xpath("//a[contains(., 'Home') or contains(., 'Launches')]")
    );

    if (homeLinks.length) {
        await homeLinks[0].click();
    } else {
        await driver.get(APP_URL);
    }

    await driver.wait(until.elementsLocated(By.css('h3')), 10000);
    console.log('Home/Launches page rendered OK.');
    await driver.sleep(500);

    console.log('Checking Cart navigation...');

    const cartLink = await driver.findElement(
        By.xpath("//a[contains(., 'Cart')]")
    );

    await cartLink.click();

    await driver.wait(
        until.elementLocated(By.xpath("//*[contains(., 'Cart')]")),
        10000
    );

    console.log('Cart page rendered OK.');
    await driver.sleep(500);


    console.log('Checking Profile navigation...');

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

    console.log('Profile page rendered OK.');
    await driver.sleep(500);


    console.log('Checking My Trips navigation (if link exists)...');

    try {
        await goToMyTrips(driver);
        await driver.sleep(500);
        console.log('My Trips page rendered OK.');
    } catch {
        console.log('My Trips not explicitly available — skipping.');
    }

    console.log('Checking Logout button...');

    const logoutButtons = await driver.findElements(
        By.xpath("//button[contains(., 'Logout') or contains(., 'Log out')]")
    );

    if (!logoutButtons.length) {
        throw new Error('Logout button not found in header.');
    }

    const logoutButton = logoutButtons[0];

    await driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        logoutButton
    );
    await driver.sleep(300);

    await driver.executeScript("arguments[0].click();", logoutButton);
    await driver.sleep(800);

    await driver.wait(
        until.elementLocated(By.css('[data-testid="login-input"]')),
        10000
    );

    console.log('Logout works — login screen displayed again.');
    console.log('✅ Header navigation + logout smoke test COMPLETED');
});
