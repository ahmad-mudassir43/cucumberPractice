package stepdefinitions;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.WebDriver;
import pages.FlipkartPage;

public class FlipkartSteps {
    private static WebDriver driver;
    private static FlipkartPage flipkartPage;

    public static void setDriver(WebDriver driver) {
        FlipkartSteps.driver = driver;
    }

    public static void setFlipkartPage(FlipkartPage flipkartPage) {
        FlipkartSteps.flipkartPage = flipkartPage;
    }

    @Given("I open the Flipkart website")
    public void i_open_the_flipkart_website() {
        flipkartPage.openWebsite();
    }

    @When("I login with username {string} and password {string}")
    public void i_login_with_username_and_password(String username, String password) {


        flipkartPage.closeLoginPopup();
        flipkartPage.login(username, password);
    }

    @Then("I search for {string}")
    public void i_search_for(String product) {
        flipkartPage.searchProduct(product);
    }
}