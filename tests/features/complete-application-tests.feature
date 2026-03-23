Feature: Complete Application Testing
  As a QA engineer
  I want to test the complete application flow
  So that I can ensure all functionality works correctly

  Background:
    Given I clear all cookies and local storage

  Scenario: Complete User Journey - Login, Navigate, Manage Products, Update Profile, and Logout
    # Login Phase
    Given I am on the login page
    When I login with username "testuser" and password "password123"
    Then I should be redirected to the dashboard page
    And I should see a welcome message containing "testuser"

    # Navigation and Dashboard Phase
    And I should see the total users statistic
    And I should see the total revenue statistic
    And I should see the total products statistic
    And I should see the total activity statistic
    And I should see the activity list

    # Products Management Phase
    When I click on the "Products" navigation link
    Then I should be on the products page
    And the "Products" navigation link should be active
    And I should see at least 3 products
    And each product should display name, category, and price

    # Search Products
    When I search for "Laptop"
    Then I should see products containing "laptop" in their name

    # Add New Product
    When I click the add product button
    Then I should see the product modal
    When I fill the product form with name "Automated Test Product", price "199.99", and category "electronics"
    And I click the save product button
    Then I should see a product with name "Automated Test Product"

    # Profile Management Phase
    When I click on the "Profile" navigation link
    Then I should be on the profile page
    And the "Profile" navigation link should be active
    And I should see the "Personal Information" section
    And I should see the "Change Password" section

    # Update Profile
    When I fill the profile form with:
      | field    | value                   |
      | fullName | Automated Test User     |
      | email    | autotest@example.com    |
      | phone    | +1 (555) 999-0000       |
      | bio      | QA Automation Specialist |
    And I click the save profile button
    Then I should see a success message "Profile updated successfully!"
    And the profile data should be saved in local storage

    # Scroll Testing
    When I click on the "Products" navigation link
    And I scroll down the page by 500 pixels
    And I scroll up the page by 300 pixels
    Then the page should be scrolled

    # Logout Phase
    When I click on the "Dashboard" navigation link
    And I click the logout button
    Then I should be redirected to the login page

  Scenario: Authentication Validation - Invalid Login and Remember Me
    # Test Invalid Credentials
    Given I am on the login page
    When I enter username "invaliduser"
    And I enter password "wrongpassword"
    And I click the login button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

    # Test Remember Me Functionality
    When I login with username "testuser" and password "password123" with remember me checked
    Then I should be redirected to the dashboard page
    And the remember me should be stored in local storage

    # Verify Logout
    When I click the logout button
    Then I should be redirected to the login page

  Scenario: Product Management - Add, Search, and Delete
    # Setup
    Given I am on the login page
    When I login with username "testuser" and password "password123"
    And I click on the "Products" navigation link

    # Add Product
    When I click the add product button
    And I fill the product form with name "Test Item To Delete", price "49.99", and category "clothing"
    And I click the save product button
    Then I should see a product with name "Test Item To Delete"

    # Search for Product
    When I search for "Test Item"
    Then I should see products containing "test item" in their name

    # Delete Product
    When I search for ""
    And I note the current number of products
    And a product with name "Wireless Mouse" exists
    And I confirm deletion
    And I delete the product "Wireless Mouse"
    Then the product "Wireless Mouse" should not be visible

    # Logout
    When I click on the "Dashboard" navigation link
    And I click the logout button
    Then I should be redirected to the login page

  Scenario: Profile Password Management
    # Setup
    Given I am on the login page
    When I login with username "testuser" and password "password123"
    And I click on the "Profile" navigation link

    # Test Password Mismatch Error
    When I fill the password form with current "password123", new "newpass456", and confirm "different"
    And I click the change password button
    Then I should see a password error message "Passwords do not match"

    # Test Short Password Error
    When I fill the password form with current "password123", new "short", and confirm "short"
    And I click the change password button
    Then I should see a password error message "New password must be at least 6 characters"

    # Test Successful Password Change
    When I fill the password form with current "password123", new "newpass123", and confirm "newpass123"
    And I click the change password button
    Then I should see a password success message "Password changed successfully!"

    # Logout
    When I click on the "Dashboard" navigation link
    And I click the logout button
    Then I should be redirected to the login page

