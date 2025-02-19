# 1. Classification of Requirements
  ## 1.1. Business/Functional Requirements
  ### Currency & Conversion
  - 1 BiPara = 1 TL
  - Users can deposit BiPara from their bank/credit cards.
  - Users can convert their CardPoints into BiPara.
  ### User Eligibility
  - Only registered users can use the wallet features.

  ### Purchasing & Refund Logic

  - Users can return their ticket bought via the wallet.
  - Tickets bought with additional services will only be returned to bank/credit cards.
  - Cannot buy tickets with additional services via the wallet or saved cards.

  ## 1.2. Open/Unresolved Questions
  - Do we return deposit from the wallet to the bank card?
  - Do we return credit card points from the wallet to the bank card?
  - Will users be able to choose their return source (e.g., buy with card A, return to card B)?
  - Will the money/point transfer expire after a year?
  - Is partial payment with the wallet available? (Needs to be discussed in details)

  ## 1.3. Potential Technical/Implementation Requirements
  - Wallet top-up flow and payment gateway integration.
  - Handling partial vs. full payments (split payments).
  - Handling the logic for refunds to different sources (wallet vs. card).
  - Conversion logic for CardPoints -> BiPara.
  - Ensuring transaction security and compliance with relevant financial regulations.


# 2. Questions & Clarifications by Role

## 2.1. Project Management
**Focus**: Overall scope, user experience, policy compliance, timeline, stakeholder alignment, and business rules.

### Refund Policy Clarification
- If a user buys a ticket only with BiPara (no additional services), do we allow a refund back to BiPara or does it have to go to a bank card?
- When tickets are partly paid via wallet (e.g., partial BiPara + partial card), how do we split the refunds?

### Regulatory / Compliance Considerations
- Are there any banking regulations or guidelines we must follow for wallet refunds vs. card refunds?
- Are there any legal constraints on converting credit-card reward points to a currency that can be refunded (BiPara)?

### User Experience & Policy
- Do we want to allow the user to choose any return source (like buying with card A, returning to card B), or must refunds be locked to the original payment source for compliance?
- Is there a maximum deposit amount or transaction limit for the wallet?
- Do we plan to expire BiPara after some period if unused?

### Business Model & Fees
- Will there be any fees for converting CardPoints to BiPara or depositing to the wallet?
- Will there be any additional fees for refunds, or do we absorb the transaction costs?

---

## 2.2. Engineering
**Focus**: System integration, data flow, APIs, performance, security, and technical feasibility.

### APIs & Integration Points
- Which external payment providers or gateways will we use to handle wallet top-ups and refunds?
- How do we integrate with the CardPoints system?

### Data Model & Transactions
- How are we tracking BiPara balance in the user’s account? Is it real-time or do we rely on an asynchronous update?
- How do we handle concurrency issues if multiple transactions happen simultaneously (e.g., partial payment + deposit at the same time)?

### Refund/Return Scenarios
- Do we require separate transaction flows for refunds to a wallet vs. refunds to a card?
- If tickets have multiple add-ons, do we have to split the payment flow into “wallet portion” and “card portion” for each add-on?

### Security & Fraud Prevention
- What security measures will be in place to prevent fraudulent transfers of BiPara (e.g., KVKK, verification)?
- How do we handle chargebacks if the user’s credit card deposit is contested by the bank after the BiPara was already used?

### Performance & Scalability
- How many wallet transactions per second (TPS) do we anticipate at peak?
- Do we have any constraints on speed of deposit, refund processing times, or user notifications?

---

## 2.3. System Design
**Focus**: Architecture, component interactions, data modeling, user flows, edge cases, UI/UX consistency.

### Workflow / User Journeys
- **Deposit Flow**:
  - How does a user deposit BiPara from a bank card?
  - Do they see a real-time update of their new wallet balance on the UI?
- **CardPoints Conversion**:
  - How does the user convert points to BiPara? Step-by-step in the UI?
  - Is there an approval or verification step?
- **Ticket Purchase**:
  - Partial payment flow diagram (wallet + card).
  - Additional services flow when paying with wallet or card.
- **Refund Flow**:
  - Different flows if a purchase is made with or without add-ons.
  - Special handling if it’s partially paid from wallet and partially from card.

### Data Structures
- What data elements are stored in the “wallet” entity? (Balance, last deposit time, deposit sources, transaction history, etc.)
- How do we record conversions from CardPoints (is that a separate ledger entry to track the origin of funds)?

### Edge Cases
- What happens if a user has insufficient balance in BiPara to complete a partial payment? Do we prompt them to deposit more?
- What if the user wants to refund after partially using BiPara and partially using a card? Must we enforce a certain refund ratio back to each source?
- If additional services were purchased but partially covered by wallet, do we handle the entire amount as a single transaction or split them?

