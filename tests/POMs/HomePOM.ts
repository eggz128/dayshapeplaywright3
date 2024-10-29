import { Locator, Page } from "@playwright/test";

export default class HomePOM {

    page: Page;
    loginLink: Locator;

    constructor(page: Page) {
        this.page = page;
        //Locators
        this.loginLink = page.getByRole('link', { name: 'Login To Restricted Area' });
    }
    //Service Methods

    async goLogin() {
        await this.loginLink.click();
    }

}