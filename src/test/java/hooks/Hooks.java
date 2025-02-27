package hooks;

import io.cucumber.java.Before;
import io.cucumber.java.After;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import pages.FlipkartPage;
import stepdefinitions.FlipkartSteps;

public class Hooks {
    private WebDriver driver;

    @Before
    public void setUp() {
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\qdnmu\\IdeaProjects\\Demo\\src\\test\\resources\\config\\chromedriver.exe");
        driver = new ChromeDriver();
        FlipkartPage flipkartPage = new FlipkartPage(driver);
        FlipkartSteps.setDriver(driver);
        FlipkartSteps.setFlipkartPage(flipkartPage);
    }

    @After
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}