import { expect } from '@playwright/test';
import { test } from './my-test';
import data from './test-data/testdata.json';
import HomePOM from './POMs/HomePOM';
import LoginPOM from './POMs/LoginPOM';

for (let credentials of data) {

  test(`test using username ${credentials.username}`, async ({ page }) => {
    await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
    await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
    await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
    await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill(credentials.username);
    await page.locator('#password').click();
    await page.locator('#password').fill(credentials.password);
    await page.getByRole('link', { name: 'Submit' }).click();
    page.on('dialog', dialog => dialog.accept());
    await page.getByRole('link', { name: 'Log Out' }).click();
  });

}

test(`test using env vars`, async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill(process.env.WD2_USERNAME ?? "");
  await page.locator('#password').click();
  await page.locator('#password').fill(process.env.WD2_PASSWORD ?? "");
  await page.getByRole('link', { name: 'Submit' }).click();
  page.on('dialog', dialog => dialog.accept());
  await page.getByRole('link', { name: 'Log Out' }).click();
});


test('using parameter', async ({ page, person }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  await page.getByRole('link', { name: 'Login To Restricted Area' }).click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').click();
  await page.getByRole('row', { name: 'User Name?' }).locator('#username').fill(person);
  await page.locator('#password').click();
  await page.locator('#password').fill('edgewords123');
})


test('using POM', async ({ page }) => {
  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/');
  const homePOM = new HomePOM(page);
  await homePOM.goLogin();

  const loginPOM = new LoginPOM(page);
  await loginPOM.loginWithValidUsernamePassword('edgewords', 'edgewords123');
})

test('screenshots and reporting',{tag:['@smoke','@regression'],
  annotation: [
    {type: 'issue', description: 'link to related issue on bug tracker https://www.google.com/'},
    {type: 'doc', description: 'link to documentation https://www.google.com/'},
  ]
} ,async ({ page, browserName }, testInfo) => {

  await page.goto('https://www.edgewordstraining.co.uk/webdriver2/docs/basicHtml.html');
  const screenshot = await page.screenshot(); //Built in assertions cannot use this - see workaround
  await page.screenshot({ path: './manualscreenshots/screenshot-viewport.png' });
  await page.screenshot({ path: './manualscreenshots/screenshot-fullpage.png', fullPage: true });

  const htmlTable = page.locator('#htmlTable');
  await htmlTable.screenshot({ path: './manualscreenshots/screenshot-table.png' });

  await page.locator('#htmlTable').screenshot({
    path: './manualscreenshots/highlight-htmltable.png',
    mask: [page.locator('#TableVal2')],
    maskColor: 'rgba(214, 21, 179,0.5)', //default mask colour is magenta #ff00ff
    style: `#htmlTable tr:nth-child(3) {border: 10px solid red}
            table#htmlTable {border-collapse: collapse}
    ` //HTML table rows cannot have a border unless the table's border collapse model is set to collapse
  })


  if (browserName !== 'firefox') { //Fx cant make PDFs with Playwright, so dont try
    //Webkit doesnt support PDF generation either
    //Make a PDF (test printing layout)
    await page.pdf({ path: './manualscreenshots/printed.pdf' })
  }

  console.log("Appears in std out section of the report")
  await testInfo.attach('Write some arbitary text to the report', {body: 'Hello World', contentType: 'text/plain'});
  await testInfo.attach('Masked Screenshot', {path: './manualscreenshots/highlight-htmltable.png', contentType: 'image/png'});
  await testInfo.attach('Screenshot from variable', {body: screenshot, contentType: 'image/png'});
})