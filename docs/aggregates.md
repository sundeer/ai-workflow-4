---
title: Aggregates & Value Objects
---

# Aggregates, Entities, and Value Objects

Defines the core aggregates, entities, value objects, and their invariants/methods in the invoicing domain.

## Aggregates

### Invoice
- **Description:** Root entity representing an invoice lifecycle.
- **Fields:**
  - `invoiceId: InvoiceId`
  - `customerId: CustomerId`
  - `status: InvoiceStatus` (e.g., Draft, Issued, Paid)
  - `lineItems: LineItem[]`
  - `total: Money`
  - `amountPaid: Money`
- **Invariants:**
  - `total` must equal the sum of all `lineItem.calculateLineTotal()`
  - `amountPaid <= total`
- **Methods:**
  - `addLineItem(item: LineItem): void`
  - `removeLineItem(itemId: LineItemId): void`
  - `calculateTotal(): Money`
  - `recordPayment(payment: Payment): void`
  - `isFullyPaid(): boolean`

### Payment
- **Description:** Records funds received against an invoice.
- **Fields:**
  - `paymentId: PaymentId`
  - `invoiceId: InvoiceId`
  - `amount: Money`
  - `date: Date`
- **Invariants:**
  - `amount.amount > 0`
  - `date <= now`
- **Methods:**
  - `applyToInvoice(invoice: Invoice): void`

## Entities

### LineItem
- **Description:** Represents a single line on an invoice.
- **Fields:**
  - `lineItemId: LineItemId`
  - `productId: ProductId`
  - `quantity: number`
  - `unitPrice: Money`
- **Invariants:**
  - `quantity > 0`
  - `unitPrice.amount >= 0`
- **Methods:**
  - `calculateLineTotal(): Money` — returns `unitPrice.multiply(quantity)`

## Value Objects

### Money
- **Description:** Represents a monetary amount in a specific currency.
- **Fields:**
  - `amount: Decimal`  
  - `currency: string` (ISO 4217 code)
- **Invariants:**
  - `amount >= 0`
  - `currency` must be a valid ISO 4217 code
- **Methods:**
  - `add(other: Money): Money`
  - `subtract(other: Money): Money`
  - `multiply(factor: number): Money`
  - `equals(other: Money): boolean`

