Feature: Flipkart Login and Search

  Scenario: Login and search for a product
    Given I open the Flipkart website
    When I login with username "your_username" and password "your_password"
    Then I search for "laptop"