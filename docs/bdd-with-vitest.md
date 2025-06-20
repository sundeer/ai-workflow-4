# BDD with Vitest

This document explains how we've implemented Behavior-Driven Development (BDD) using Vitest instead of Cucumber/Gherkin.

## Overview

Behavior-Driven Development (BDD) is a software development approach that focuses on the behavior of an application from the user's perspective. Traditionally, tools like Cucumber with Gherkin syntax are used for BDD, but they can be verbose and add complexity to the testing setup.

This project demonstrates how to implement BDD using Vitest, a modern JavaScript testing framework, providing a more streamlined approach while maintaining the essence of BDD.

## Approaches

We've implemented two different approaches to BDD with Vitest:

### 1. Nested Describe Approach

This approach closely mirrors the Gherkin syntax structure using nested `describe` blocks:

```typescript
describe('Scenario: Create a valid invoice', () => {
  // GIVEN
  describe('GIVEN a customer with ID "CUST-123" exists', () => {
    const { customerId } = givenCustomerExists('CUST-123');
    
    // WHEN
    describe('WHEN I create a new invoice with line items', () => {
      const { invoice } = whenCreatingInvoiceWithLineItems(customerId, [...]);
      
      // THEN
      it('THEN the invoice should be created in status "Draft"', () => {
        expect(invoice.status).toBe('Draft');
      });
      
      it('THEN the invoice total should be "200.00 USD"', () => {
        expect(invoice.calculateTotal().toString()).toBe('200.00 USD');
      });
    });
  });
});
```

### 2. Concise Approach

This approach uses a single `it` block with comments to indicate the Given/When/Then steps:

```typescript
it('should create a valid invoice', () => {
  // GIVEN a customer with ID "CUST-123" exists
  const { customerId } = givenCustomerExists('CUST-123');
  
  // WHEN I create a new invoice with line items
  const { invoice } = whenCreatingInvoiceWithLineItems(customerId, [...]);
  
  // THEN the invoice should be created in status "Draft"
  expect(invoice.status).toBe('Draft');
  
  // AND the invoice total should be "200.00 USD"
  expect(invoice.calculateTotal().toString()).toBe('200.00 USD');
});
```

## Helper Functions

To make the tests more readable and maintain the BDD style, we've created helper functions that follow the Given/When/Then pattern:

```typescript
function givenCustomerExists(id: string) {
  // Assume customer validation logic here
  return { customerId: id };
}

function whenCreatingInvoiceWithLineItems(customerId: string, items: Array<{...}>) {
  const invoice = new Invoice(customerId);
  items.forEach(item => {
    invoice.addLineItem(new LineItem(item.productId, item.quantity, Money.fromString(item.unitPrice)));
  });
  return { invoice };
}
```

## Benefits Over Cucumber

1. **Reduced Complexity**: No need for separate feature files, step definitions, and world objects
2. **Better IDE Support**: Full TypeScript/JavaScript support without plugins
3. **Faster Execution**: Direct test execution without the Cucumber layer
4. **Easier Debugging**: Simpler stack traces and breakpoint setting
5. **Still BDD-Focused**: Maintains the Given/When/Then structure and behavior focus

## Running the Tests

To run the BDD tests:

```bash
npm test
```

To run the tests in watch mode:

```bash
npm run test:watch
```

## Migrating from Cucumber

If you're migrating from Cucumber to this approach:

1. Identify the scenarios in your feature files
2. Create helper functions for your Given/When/Then steps
3. Implement the scenarios using either the nested describe approach or the concise approach
4. Use comments to maintain readability and document the steps

## Conclusion

This approach provides a more streamlined way to implement BDD while maintaining its core principles. It reduces the overhead of using Cucumber while still focusing on behavior and providing readable tests that can serve as documentation.