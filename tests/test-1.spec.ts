import { test, expect } from '@playwright/test';

test.use({actionTimeout: 5000});


test.beforeAll(async ({ page }) => {
  console.log("Runs once at beginning of test run");
})

test.afterAll(async ({ page }) => {
  console.log("Runs once all tests in file have completed")
})

test.beforeEach(async ({ page }) => {
  console.log("Runs before each test (initially after beforeAll)")
})

test.afterEach(async ({ page }) => {
  console.log("Runs after each test")
})

test.describe('A test suite', ()=>{

  test.beforeEach(async ({ page }) => {
    console.log("Before each test in the describe block");
  })

  test.describe('An inner test suite', ()=>{
    test('test', async ({ page }) => {

      test.setTimeout(60000); //Test timeout
    
      await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
      await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
      await page.getByRole('row', { name: 'User Name?' }).locator('#username').click({timeout: 3000});
      await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill('edgewords');
      await page.getByRole('row', { name: 'User Name?' }).locator('#username').clear();
      await page.getByRole('row', { name: 'User Name?' }).locator('#username').pressSequentially('edgewords', {delay: 1000});
    
    
      await expect(page.getByRole('row', { name: 'User Name?' }).locator('#username')).toHaveScreenshot();
    
    
        // await page.click('#password'); //Discouraged
      // await page.locator('#password').fill('edgewords123');
      //await page.waitForSelector('#password', {timeout: 3000, state: 'hidden'});
      const pwField =  page.locator('#password');
      await pwField.fill('edgewords123');
    
      await page.getByRole('link', { name: 'Submit' }).click();
    
      const slowExpect = expect.configure({timeout: 7000});
    
      await slowExpect(page.getByRole('link', { name: 'Log Out' })).not.toBeVisible();
      await slowExpect.soft(page.locator('h1')).toContainText('Add A Record To the DatabaseXXXXXXX');
      //Click the OK button in the js prompt
      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('link', { name: 'Log Out' }).click();
      
      await page.goto('https://www.edgewordstraining.co.uk/webdriver2/sdocs/auth.php');
      await expect(page.locator('h1')).toContainText('Access and Authentication');
    });
    
    test('test2', async ({page})=>{
    
      await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
      //await page.getByRole('link', { name: 'dismiss', exact: true }).click();
      await page.getByRole('searchbox', { name: 'Search for:' }).click();
      //await page.getByRole('searchbox', { name: 'Search for:' }).fill('belt');
      await page.getByPlaceholder('Search products…').nth(0).fill('belt');
      await page.getByRole('searchbox', { name: 'Search for:' }).press('Enter');
      await page.pause();
      await page.getByRole('button', { name: 'Add to cart' }).click();
      await page.locator('#content').getByRole('link', { name: 'View cart ' }).click();
      //await page.locator('text=View cart').getByRole('link', { name: 'View cart ' }).click();
      
      await page.getByLabel('Remove this item').click();
      await page.getByRole('link', { name: 'Return to shop' }).click();
      await page.locator('#menu-item-42').getByRole('link', { name: 'Home' }).click();
    
    })
    
    
    test('all products', async ({ page }) => {
      await page.goto('https://www.edgewordstraining.co.uk/demo-site/');
      const newProducts = page.getByLabel('Recent Products');
      for (const prod of await newProducts.locator('h2:not(.section-title)').all()) { //gathers a collection of all() matching elements
        console.log(await prod.textContent()); //then loops over each individual match logging the text
      };
      
    });
  })
  
  
  test('Locator Handler', async ({ page }) => {
    // Setup the handler.
    const cookieConsent = page.getByRole('heading', { name: 'Hej! You are in control of your cookies.' });
    await page.addLocatorHandler(
      cookieConsent, //Locator to watch out for
      async () => { //If spotted, what to do
        await page.getByRole('button', { name: 'Accept all' }).click();
      }
      , //Optional arguments - can be omitted
      {
        times: 10, //How many times the locator may appear before the handler should stop handling the locator
        //By default Playwright will wait for the locator to no longer be visible before continuing with the test.
        noWaitAfter: true //this can be overridden however
      }
    );
  
    // Now write the test as usual. If at any time the cookie consent form is shown it will be accepted.
    await page.goto('https://www.ikea.com/');
    await page.getByRole('link', { name: 'Collection of blue and white' }).click();
    await expect(page.getByRole('heading', { name: 'Light and easy' })).toBeVisible();
  
    //If you're confident the locator will no longer be found you can de-register the handler
    //await page.removeLocatorHandler(cookieConsent);
    //If the cookie consent form appears from here on it may cause issues with the test...
    await page.waitForTimeout(5000);
  })
  
  
  test('drag drop slider', async ({ page }) => {
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/cssXPath.html')
  
    await page.locator('#apple').scrollIntoViewIfNeeded();
    //Dragging 'outside' of an element normally fails due to 'actionability' checks. force:true tells Playwright just to do the action skipping any checks.
    // await page.dragAndDrop('#slider a', '#slider a', {targetPosition: {x: 100, y:0}, force: true}) //While this moves the gripper it wont change the size of the apple - this is due to the JS on the page that does the resizing not firing properly for large movements
  
    //So instead do lots of little jumps. Just make sure that you 'jump' far enough to get 'outside' the gripper each time
    await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
    await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
    await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
    await page.dragAndDrop('#slider a', '#slider a', { targetPosition: { x: 20, y: 0 }, force: true })
    //We should probably write a custom function for this 'lots of little jumps' drag and drop...
    //await smoothDrag(page, '#slider a', 200, 5);
  
  })
  
  test("compare runtime images", async ({page, browserName}, testInfo)=>{
    await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");
  
    await page.locator('#textInput').fill("Hello World"); //Set intial state
    
    //ToDo: capture screenshot of text box in memory
    //Capture in mem is easy - doing the expect on it after, not so much as PlayWright expect .toMatchSnapshot() expects the screenshot to be on disk
    //See https://github.com/microsoft/playwright/issues/18937
  
    //const originalimage = await page.locator('#textInput').screenshot();
    //originalimage is now a buffer object with the screenshot. You could use a 3rd party js lib to do the comparison... but if we're sticking to Playwright only...
  
    //await expect(page.locator('#textInput')).toHaveScreenshot('textbox')
    //No good as PW wants to capture the screenshot on the first run and use that screenshot for following runs. We want to capture and use on this run. So...
  
    await page.locator('#textInput').screenshot({path: `${testInfo.snapshotDir}/textbox-${browserName}-${testInfo.snapshotSuffix}.png`})
    //screenshots will need to vary by browser and OS, and be saved in to the test snapshot directory for .toMatchSnapshot() to find them
  
    
    //Change element text
    await page.locator('#textInput').fill("Hello world"); //Alter the state (right now this is the same as initially set so following expect *should* pass)
                                                            //change to e.g. "Hello world"
  
    //Recapture screenshot, compare to previous (on disk) version.
    expect(await page.locator('#textInput').screenshot()).toMatchSnapshot('textbox.png')
  
    //Now go look at the html report
  });


})


test("Capturing values", async ({ page }) => {
  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html");
  await page.locator('#textInput').fill("Hello World");

  let rightColText = await page.locator('#right-column').textContent(); //Includes whitespace in HTML file

  console.log("The right column text is with textContent is: " + rightColText);

  rightColText = await page.locator('#right-column').innerText(); //Captures text after browser layout has happened (eliminating most whitespace)

  console.log("The right column text is with innertext is: " + rightColText);

  let textBoxText: string = await page.locator('#textInput').textContent() ?? ""; //TS: if textContent() returns null, retuen empty string "" instead
  console.log("The text box contains" + textBoxText); //blank as <input> has no inner text

  //Using generic $eval to get the browser to return the INPUT text
  //This will *not* retry or wait
  textBoxText = await page.$eval('#textInput', (el: HTMLInputElement) => el.value); //el is an in browser HTML element - not a Playwright object at all.
  console.log("The text box actually contains: " + textBoxText);

  // await page.$eval('#textInput', elm => {
  //     console.log(typeof(elm))
  // });

  expect(textBoxText).toBe("Hello World");
});

test("Generic methods", async ({ page }) => {

  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/forms.html")

  const menuLinks = await page.$$eval('#menu a', (links) => links.map((link) => link.textContent))
  console.log(`There are ${menuLinks.length} links`)

  console.log("The link texts are:")

  for (const iterator of menuLinks) {
      console.log(iterator?.trim())
  }

  //Preferred - using retry-able Playwright locators
  const preferredLinks = await page.locator('#menu a').all();
  for (const elm of preferredLinks) {
      // const elmtext = await elm.textContent();
      // const elmtexttrimmed = elmtext?.trim();
      console.log(`${await elm.textContent().then(text => { return text?.trim() })}`)
  }
})

test('Actionability', async ({ page }) => {
  page.setDefaultTimeout(5000);
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/dynamicContent.html');

  await page.locator('#delay').click();
  await page.locator('#delay').fill('10');
  await page.getByRole('link', { name: 'Load Content' }).click();
  await page.locator('#image-holder > img').click(); //Apple image
  await page.getByRole('link', { name: 'Home' }).click();

})

test("Waiting for a pop up window", async ({ page, context }) => {
  await page.goto("https://www.edgewordstraining.co.uk/webdriver2/docs/dynamicContent.html")

  const [newPage] = await Promise.all([ //When these two "future" actions complete return the new page fixture
    context.waitForEvent('page'),
    page.locator("#right-column > a[onclick='return popUpWindow();']").click()
  ])

  await page.waitForTimeout(2000); //Thread.sleep(2000);


  const closeBtn = newPage.getByRole('link', { name: 'Close Window' }); //closes the newly opened popup //Not working in Firefox?
  await closeBtn.click();

  await page.getByRole('link', { name: 'Load Content' }).click();

})

test('listen for console message', async ({ page }) => {

  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/')

  page.on('console', (msg) => { //onging event listener - consider using .once if this is an event that shoould only be listened for once
      console.log(`The message was ${msg.text()}`) //will run each time the browser console has an event
  })

  await page.waitForTimeout(30000)

});

test('wait for console message before continuing', async ({ page }) => {

  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/')


  await page.waitForEvent('console', { //will wait here until the specific console message is found (or the wait times out)
      predicate: (message) => message.text().includes('hi'),
      timeout: 15000,
  }); //Now do a console.log('hi') in the browser dev tools to continue. Any other message will be ignored.

  await page.goto('https://www.google.com')
  await page.waitForTimeout(10000)

});