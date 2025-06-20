---
title: Glossary
---

# Glossary

A table capturing key terms and definitions (ubiquitous language) for the invoicing domain:

| Term     | Definition                                                                                   | Usage / References                                 |
|----------|----------------------------------------------------------------------------------------------|----------------------------------------------------|
| Invoice  | A document sent to a customer requesting payment for goods or services delivered.            | `behaviors/place-invoice.feature`                  |
| LineItem | An entry on an invoice specifying a product or service, the quantity purchased, and unit price. | `src/domain/invoice/InvoiceAggregate`              |
| Customer | The entity that receives invoices and makes payments.                                        | `behaviors/pay-invoice.feature`                    |
| Payment  | The record of funds received from a customer against one or more invoices.                    | `src/domain/payment/PaymentAggregate`              |
| Money    | A value object representing a monetary amount and currency (e.g., 100.00 USD).                | `src/domain/value-objects/Money`                   |