package pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class FlipkartPage {
    WebDriver driver;

    // Locators
    private static final By CLOSE_LOGIN_POPUP = By.cssSelector("[class='_30XB9F']");
    private static final By LOGIN_BUTTON = By.xpath("//a/span[contains(text(),'Login')]");
    private static final By USERNAME_FIELD = By.xpath("//input[@class='r4vIwl BV+Dqf']");
    private static final By PASSWORD_FIELD = By.xpath("//input[@type='password']");
    private static final By SUBMIT_BUTTON = By.xpath("//button[@type='submit']");
    private static final By SEARCH_BOX = By.name("q");

    public FlipkartPage(WebDriver driver) {
        this.driver = driver;
    }

    public void openWebsite() {
        driver.get("https://www.flipkart.com");
        driver.manage().window().maximize();
    }

    public void closeLoginPopup() {
        WebElement closeLoginPopup = driver.findElement(CLOSE_LOGIN_POPUP);
        closeLoginPopup.click();
    }

    public void login(String username, String password) {
        WebElement loginButton = driver.findElement(LOGIN_BUTTON);
        loginButton.click();
        WebElement usernameField = driver.findElement(USERNAME_FIELD);
        WebElement passwordField = driver.findElement(PASSWORD_FIELD);
        WebElement submitButton = driver.findElement(SUBMIT_BUTTON);
        usernameField.sendKeys(username);
        passwordField.sendKeys(password);
        submitButton.click();
    }

    public void searchProduct(String product) {
        WebElement searchBox = driver.findElement(SEARCH_BOX);
        searchBox.sendKeys(product);
        searchBox.submit();
    }
}