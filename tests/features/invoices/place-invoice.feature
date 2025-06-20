Feature: Place an Invoice
  As a billing user
  I want to create a new invoice for a customer
  So that I can request payment for delivered goods or services

  Scenario: Create a valid invoice
    Given a customer with ID "CUST-123" exists
    When I create a new invoice for customer "CUST-123" with the following line items:
      | productId | quantity | unitPrice  |
      | PROD-001  | 2        | 50.00 USD  |
      | PROD-002  | 1        | 100.00 USD |
    Then the invoice should be created in status "Draft"
    And the invoice total should be "200.00 USD"

  Scenario: Add a line item to an existing invoice
    Given an existing invoice "INV-456" with no line items
    When I add a line item with productId "PROD-003", quantity 3, and unitPrice "25.00 USD"
    Then the invoice should contain 1 line item
    And the invoice total should be "75.00 USD"

  Scenario: Prevent invoice creation with invalid data
    Given a customer with ID "CUST-789" exists
    When I attempt to create an invoice with a line item having quantity 0
    Then an error "InvalidLineItemQuantity" should be thrown