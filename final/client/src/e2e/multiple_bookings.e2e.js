const { runSingle, login, goToLaunchList, APP_URL, By, until } = require('./helpers.e2e');

runSingle('Multiple bookings via cart and Book All', async (driver) => {
    await login(driver, 'test@test.com');
    await driver.sleep(500);

    await goToLaunchList(driver);
    await driver.sleep(500);

    const bookedMissions = [];

    for (let i = 0; i < 5; i++) {
        await goToLaunchList(driver);

        await driver.executeScript('window.scrollTo(0, 0);');
        await driver.sleep(300);

        const headings = await driver.findElements(By.css('h3'));
        if (i >= headings.length) {
            console.log(`Only found ${headings.length} launches, stopping at index ${i}.`);
            break;
        }

        const heading = headings[i];
        const missionName = await heading.getText();
        console.log(`Adding mission to cart: ${missionName}`);
        bookedMissions.push(missionName);

        await driver.executeScript(
            "arguments[0].scrollIntoView({block:'center'});",
            heading
        );
        await driver.sleep(300);
        await driver.executeScript("arguments[0].click();", heading);

        await driver.wait(
            until.elementsLocated(By.css('h5')),
            10000
        );
        await driver.sleep(500);

        const addToCartButtons = await driver.findElements(
            By.xpath("//button[contains(., 'Add to Cart')]")
        );
        if (!addToCartButtons.length) {
            throw new Error('Add to Cart button not found on launch detail page.');
        }
        await addToCartButtons[0].click();
        await driver.sleep(700);

        const homeLinks = await driver.findElements(
            By.xpath("//a[contains(., 'Home') or contains(., 'Launches')]")
        );
        if (homeLinks.length) {
            await homeLinks[0].click();
        } else {
            await driver.get(APP_URL);
        }

        await driver.wait(
            until.elementsLocated(By.css('h3')),
            10000
        );
        await driver.sleep(500);
    }

    if (bookedMissions.length === 0) {
        throw new Error('No missions were added to cart; cannot test Book All.');
    }

    console.log('Missions added to cart:', bookedMissions.join(', '));

    const cartLink = await driver.findElement(
        By.xpath("//a[contains(., 'Cart')]")
    );
    await cartLink.click();

    await driver.wait(
        until.elementLocated(By.xpath("//*[contains(., 'Cart')]")),
        10000
    );
    await driver.sleep(700);

    let bookAllButton;

    const byText = await driver.findElements(
        By.xpath("//button[contains(., 'Book All')]")
    );
    if (byText.length) {
        bookAllButton = byText[0];
    } else {
        const byTestId = await driver.findElements(
            By.css('[data-testid="book-button"]')
        );
        if (byTestId.length) {
            bookAllButton = byTestId[0];
        }
    }

    if (!bookAllButton) {
        throw new Error('Book All button not found in Cart.');
    }

    await driver.executeScript(
        "arguments[0].scrollIntoView({block:'center'});",
        bookAllButton
    );
    await driver.sleep(300);
    await driver.executeScript("arguments[0].click();", bookAllButton);
    await driver.sleep(1000);

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

    const bodyText = await driver.findElement(By.css('body')).getText();
    const missing = bookedMissions.filter(
        (name) => !bodyText.includes(name)
    );

    if (missing.length) {
        throw new Error(
            `The following missions were added to cart & booked, but NOT found on Profile/My Trips: ${missing.join(', ')}`
        );
    }

    console.log(
        `Success: all booked missions appear in Profile/My Trips:\n${bookedMissions.join('\n')}`
    );
});
