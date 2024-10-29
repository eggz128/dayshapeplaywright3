import { Locator, Page } from "@playwright/test";

export default class LoginPOM {

    page: Page

    usernameField: Locator
    passwordField: Locator
    submitButton: Locator

    constructor(page: Page){
        this.page = page

        //Locators
        this.usernameField = page.locator('#username:visible');
        this.passwordField = page.locator('#password');
        this.submitButton = page.getByRole('link', { name: 'Submit' });
    }
    
    //Service method
    async loginWithValidUsernamePassword(username: string, password: string){
        
        await this.usernameField.fill(username);
        await this.passwordField.fill(password);
        await this.submitButton.click();
    }
}

