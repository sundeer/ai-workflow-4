# AI Workflow Comparison: Invoice Management System

## 🎯 Project Overview

This repository demonstrates a comparative study of different AI-assisted development workflows by implementing an invoice management system using Domain-Driven Design (DDD) principles and Behavior-Driven Development (BDD) testing approaches.

## 🧪 Experiment Design

The project serves as a controlled experiment where the same prompt and requirements were given to four different combinations of AI coding assistants and IDEs:

### Original Prompt
> "I would like you to review the files in @docs and implement the behavior defined in @create-invoice.md."

### AI/IDE Combinations Tested

| Branch | IDE | AI Assistant | Model |
|--------|-----|--------------|-------|
| `bdd-jetbrains-ai-assistant-claud4` | JetBrains | AI Assistant | Claude 4 |
| `bdd-jetbrains-gemini2.5pro` | JetBrains | AI Assistant | Gemini 2.5 Pro |
| `bdd-jetbrains-junie` | JetBrains | AI Assistant | Junie |
| `bdd-windsurf-swe1` | Windsurf | Built-in AI | SWE1 |
| `master` | N/A | N/A | Baseline (bare bones) |

## 🏗️ Tech Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.10
- **Testing**: Vitest 3.2.4 with BDD approach
- **Code Quality**: ESLint with TypeScript support
- **Architecture**: Domain-Driven Design (DDD)

## 📋 Requirements

The AI systems were provided with comprehensive documentation in the `docs/` directory:

### Domain Model (`docs/aggregates.md`)
- **Invoice Aggregate**: Root entity managing invoice lifecycle (Draft → Issued → Paid)
- **Payment Aggregate**: Records funds received against invoices
- **LineItem Entity**: Individual invoice line with product, quantity, and pricing
- **Money Value Object**: Monetary amounts with currency support

### Bounded Contexts (`docs/contexts.md`)
- **Billing Context**: Core responsibility for invoice management and calculations
- **Context Map**: Relationships with Customer and Payment contexts

### Testing Approach (`docs/bdd-with-vitest.md`)
- BDD implementation using Vitest instead of Cucumber/Gherkin
- Given/When/Then structure with helper functions
- Streamlined approach maintaining BDD principles

### Domain Language (`docs/glossery.md`)
- Ubiquitous language definitions for Invoice, LineItem, Customer, Payment, Money
- Clear terminology and usage references

### Feature Requirements (`tests/features/invoice/create-invoice.md`)
Three main scenarios to implement:
1. **[INV-001]** Create valid invoice with multiple line items
2. **[INV-002]** Add line items to existing invoices
3. **[INV-003]** Prevent invalid invoice creation with proper validation

## 🔍 How to Explore the Results

### 1. Compare Implementations
```bash
# Switch between branches to see different AI implementations
git checkout bdd-jetbrains-ai-assistant-claud4
git checkout bdd-jetbrains-gemini2.5pro
git checkout bdd-jetbrains-junie
git checkout bdd-windsurf-swe1
```

### 2. Run Tests
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

### 3. Development Server
```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## 📊 Evaluation Criteria

When comparing the different AI implementations, consider:

- **Code Quality**: TypeScript usage, error handling, code organization
- **DDD Implementation**: Proper aggregate boundaries, value objects, invariants
- **BDD Testing**: Test readability, Given/When/Then structure, coverage
- **Architecture**: Separation of concerns, maintainability, scalability
- **Requirements Fulfillment**: How well each implementation meets the specified scenarios

## 🎓 Learning Outcomes

This experiment provides insights into:
- Effectiveness of different AI coding assistants
- Impact of IDE integration on AI-assisted development
- Consistency in implementing complex architectural patterns
- Quality of generated tests and documentation
- Adherence to domain-driven design principles

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Explore the baseline: `git checkout master`
4. Compare AI implementations by switching branches
5. Run tests to see different approaches: `npm test`
6. Review the generated code and test quality

## 📁 Project Structure

```
├── docs/                    # Domain documentation and requirements
│   ├── aggregates.md       # Domain model definitions
│   ├── bdd-with-vitest.md  # Testing approach
│   ├── contexts.md         # Bounded contexts
│   └── glossery.md         # Domain terminology
├── tests/
│   └── features/
│       └── invoice/
│           └── create-invoice.md  # Feature requirements
├── src/                    # Implementation (varies by branch)
└── README.md              # This file
```

---

*This project demonstrates the current state of AI-assisted development and provides a framework for evaluating different AI coding tools in complex, real-world scenarios.*
