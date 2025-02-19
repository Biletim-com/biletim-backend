# Additional Services Requirements & Clarifications

## 1. **Biletim Güvende**

### 1.1. Known Requirements

1. **Eligibility & Refund**  
   - Passengers can cancel their plane ticket (one-way or round-trip) up to **3 hours** before the departure time.  
   - Upon successful cancellation, the user receives **90%** of the ticket price.  
   - If a round-trip flight is on a **single ticket** (even if operated by different airlines), **both** flights must be canceled together, following airline rules, up to **3 hours** before the **departure of the first flight**.  
   - If a round-trip flight consists of **separate tickets** (multiple PNRs), each flight can be canceled separately before the **corresponding** departure time, assuming the provider sells them as separate tickets. (IT HAS TO BE DISCUSSED)

2. **Cancellation Process**  
   - Cancellation can be initiated by:  
     - Calling **0850 244 2586**, or  
     - Using the **Cancellation Flow in the App**.  
   - **Partial cancellations** (e.g., only one leg of a round trip if it is on the **same PNR**) are not allowed.  
   - **Users cannot cancel checked-in tickets**.  
   - **Users cannot cancel additional services** alone.  

3. **Refund & Timeline**  
   - The refund transaction is **initiated by Biletim.com** within **7 business days** (though there is a question regarding whether it can be done immediately).  
   - Users **do not receive a refund** for the canceled flight if it does not meet the conditions (e.g., attempted cancellation after check-in, or less than 3 hours before departure).  
   - Refunded amount is deposited to the user’s bank or wallet account (based on the user’s preference).  

4. **Other Considerations**  
   - The user pays for the ticket with the understanding that if they purchase Biletim Güvende, they are entitled to the above privileges.  
   - No refund is given for the **additional services** if the entire ticket is canceled.

---

### 1.2. Questions & Clarifications

#### Project Management

1. **Refund Timeline**  
   - The requirement states **7 business days** for refunds. Is there a possibility to make this immediate or faster? Are there any constraints from banking partners? Don't we initiate refund immediately in the code?
2. **Scope of Service**  
   - Should Biletim Güvende also apply to other travel segments (e.g., multi-city tickets), or strictly one-way/round-trip?
3. **User Communication**  
   - What channels are we using to **notify** users about their eligibility and the 3-hour deadline?  

#### Engineering

1. **PNR Management**  
   - How do we **detect** if a round-trip ticket is issued as a single PNR or multiple PNRs (especially if different airlines are involved)?  
2. **Automation of Refund**  
   - What triggers the workflow (cancellation event, customer support call, or both)?  
   - How the customers get notified abouth the cancellation?


---

## 2. **Biletim iadeJet**

### 2.1. Known Requirements

1. **Privileged Service**  
   - Users who purchase Biletim iadeJet pay an **extra 20 TL** per person.  
   - This service allows them to **bypass the long refund process** typically associated with airline ticket cancellations.  
   - The user’s cancellation request is **prioritized** and the refund is handled by Biletim.com with minimal airline intervention.

2. **Scope & Process**  
   - The user presumably starts the process either via the app(?) or customer support.  
   - Biletim.com handles the **complexity** of dealing with the airline for cancellation and refund processes.  
   - Timeline and exact **refund rate** are not fully detailed; we assume it covers the entire ticket price minus the service fee.

---

### 2.2. Questions & Clarifications

#### Project Management

1. **Service Definition & Pricing**  
   - Is the **20 TL** fee fixed, or can it vary by season, airline, or other factors?

#### Engineering

1. **Backend Workflow**  
   - How is the **iadeJet** workflow different from the normal refund workflow in terms of system architecture?  
   - Do we need a **separate queue or microservice** to handle iadeJet requests?
2. **Integration with Payment Gateways**  
   - Are we using the same payment providers as the standard refund process?  
   - Do we need **separate ledger entries** for the iadeJet fee?

#### System Design

1. **Process Flow**  
   - Once the user selects iadeJet, do they get a **separate cancellation flow** or is it integrated within the standard cancellation?  
   - How do we display the **status** of their refund (e.g., faster processing time) to the user?

---

## 3. **Biletim Express CHECK-IN**

### 3.1. Known Requirements

1. **Check-In Service**  
   - The provider does **not support check-ins** directly. There is no automated process in place.  
   - Users cannot perform check-in via Biletim Express.  

2. **Implications**  
   - If check-in is not supported, it means Biletim.com relies on the **airline’s** own check-in process.  
   - This may affect Biletim Güvende and iadeJet because if the passenger **already checked in** via the airline, cancellation may be disallowed.

---

### 3.2. Questions & Clarifications

#### Project Management

1. **Service Roadmap**  
   - Do we have any **future plans** to support check-in with partner airlines directly?  
   - Should we remove or hide any references to “Express CHECK-IN” if it is not supported at all?

#### System Design

1. **UI/UX**  
   - Since check-in is not available, how do we handle the **messaging** around “Biletim Express CHECK-IN”?  
   - Should the user see an explanation or a future placeholder?

---

## 4. **Summary**

- **Biletim Güvende** is a premium cancellation policy that offers 90% refunds up to 3 hours before departure for both one-way and round-trip tickets (if on a single PNR, cancellation is all-or-none).  
- **Biletim iadeJet** is an expedited refund service costing 20 TL per passenger, with an aim to reduce user hassle in dealing with airlines.  
- **Biletim Express CHECK-IN** is not currently supported due to provider limitations, which impacts how cancellations can be processed once a user has checked in elsewhere.
