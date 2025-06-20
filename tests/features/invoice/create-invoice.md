# 🧾 Invoice Management

## Feature Description
As a billing user  
I want to create a new invoice for a customer  
So that I can request payment for delivered goods or services

## Scenarios

### [INV-001] Create Valid Invoice
**Description**: Verify that a valid invoice can be created with multiple line items

**Given** a customer with ID "CUST-123" exists  
**When** I create a new invoice for customer "CUST-123" with the following line items:

| productId | quantity | unitPrice |
|-----------|----------|-----------|
| PROD-001  | 2        | 50.00 USD |
| PROD-002  | 1        | 100.00 USD|

**Then** the invoice should be created in status "Draft"  
**And** the invoice total should be "200.00 USD"

---

### [INV-002] Add Line Item to Invoice
**Description**: Verify that line items can be added to an existing invoice

**Given** an existing invoice "INV-456" with no line items  
**When** I add a line item with productId "PROD-003", quantity 3, and unitPrice "25.00 USD"  
**Then** the invoice should contain 1 line item  
**And** the invoice total should be "75.00 USD"

---

### [INV-003] Prevent Invalid Invoice Creation
**Description**: Ensure that invoices with invalid data cannot be created

**Given** a customer with ID "CUST-789" exists  
**When** I attempt to create an invoice with a line item having quantity 0  
**Then** the system should reject the operation with an appropriate error message

## Implementation Notes
- **ID Format**: `INV-XXX` where XXX is a sequential number
- **Monetary Values**: Use format "100.00 USD"
- **Status Flow**: Draft → [other statuses]
- **Validation**: Line items require positive quantity
- **Calculation**: Total = Σ(quantity * unitPrice)
