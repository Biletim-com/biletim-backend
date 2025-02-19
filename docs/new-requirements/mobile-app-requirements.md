## 1. Mobile App Specific Price

### 1.1 Project Manager

1. **Scope & Business Logic**  
   - What exact benefit do we aim to provide by offering a special price in the mobile app versus other platforms?  
   - Is this feature intended to drive mobile app downloads, or is it part of a larger promotional strategy?

2. **Audience & User Requirements**  
   - Do users need to be logged in to see and benefit from the mobile-specific pricing?  
   - Should mobile-only deals be displayed to all app users, or only to selected segments?

3. **Timeline & Deliverables**  
   - When should this feature be live? Is it tied to a specific marketing campaign or release milestone?  
   - How do we measure success? (e.g., increase in mobile conversion rates, number of bookings, or user adoption?)

5. **Risks & Mitigation**  
   - Could offering lower mobile prices cause channel conflicts or partner pushback?  
   - How do we handle user confusion if they see a different price on desktop vs. mobile?

---

### 1.2 Engineering

1. **Technical Architecture**  
   - How will the system differentiate between mobile app requests vs. other channels (web, third-party)?  
   - Where in the existing pricing engine do we integrate the “mobile app discount” logic?

2. **Data & Backend Services**  
   - Will we store separate price entries for mobile channels in the database, or apply a dynamic discount formula?  
   - Can this be an extension of an existing pricing service or do we need a new microservice?

3. **Security & Access Control**  
   - If a user needs to be logged in, how is authentication handled for mobile discounts?  
   - How do we prevent unauthorized access to these discounted prices from other channels?

5. **Integration with Wallet or Payment Systems**  
   - Will these mobile-exclusive prices integrate with any existing wallet or payment module for reward points?  
   - Do we need to adjust transaction workflows for discounted pricing?

---

### 1.3 System Design

1. **User Flow & Interface**  
   - How will the user discover and interact with the discounted price in the mobile app?  
   - Does the user journey differ when they are not logged in vs. logged in?

2. **Edge Cases & Conditions**  
   - What if a user switches from mobile to web mid-transaction? Does the price stay discounted?  
   - Are there multiple discount tiers (e.g., 5% for basic, 10% for premium)?

3. **Wireframes & UX**  
   - How should the discounted price be displayed compared to the standard price?  
   - Will there be a badge or label indicating “mobile exclusive”?

5. **Design Consistency**  
   - Do we have a consistent style or visual identifier for special prices across the app?  
   - Any color schemes or icons for “mobile only” deals?

---

## 2. Person-Specific Campaigns

### 2.1 Project Management

1. **Campaign Types & Scope**  
   - Are the campaigns targeting hotels, buses, plane tickets, or a combination?  
   - What is the primary goal: retaining loyal customers, upselling, or cross-selling?

2. **Targeting & Eligibility Criteria**  
   - How do we define which users get which campaign? (e.g., loyalty tier, past purchases)  
   - Do we need user consent for personalized offers, especially if location or usage data is involved?

3. **Operational & Marketing Coordination**  
   - Will Marketing define the campaign content and eligibility, or is it automated by system rules?  
   - How do we measure success (campaign redemption rate, uplift in sales, user retention)?

4. **Legal & Compliance**  
   - Are there data privacy considerations in identifying users for personalized offers?  
   - Do we need to address GDPR or other regional regulations?

---

### 2.2 Engineering

1. **Data Pipelines & Personalization Logic**  
   - Which user attributes (history, location, membership status) are used for campaign eligibility?  
   - How do we keep these data points updated (real-time APIs, batch jobs)?

2. **Campaign Configuration**  
   - Will we build a dedicated Campaign Management System, or integrate with an existing one?  
   - Where are campaign rules, start/end dates, and user segments stored?

3. **Scalability & Performance**  
   - How do we ensure real-time or near-real-time eligibility checks do not degrade system performance?  
   - If the user base is large, do we need caching or queue systems?

4. **Integration with Other Modules**  
   - Should campaigns be tied to wallet credits or external loyalty programs?  
   - How do we track campaign usage to update user profiles?

---

### 2.3 System Design

1. **User Journey & Campaign Discovery**  
   - How do users become aware of personalized campaigns—via notification, dashboard, or checkout flow?  
   - Should campaigns automatically appear if the user is eligible?

2. **Campaign Content & UX**  
   - Do campaigns offer discounts, bonus points, or special features?  
   - Should we visually differentiate campaign offers with specific banners or color coding?

3. **Edge Cases & Eligibility**  
   - What if a user partially meets campaign criteria? Is there partial discount or no discount?  
   - Can multiple campaigns be combined, or is only one allowed at a time?

4. **Dashboard & Analytics**  
   - Do we need a “My Offers” section for active/expired campaigns?  
   - Should we display how many times a user redeemed a specific offer?

---

## 3. Live Price Notifications

### 3.1 Project Management

1. **Objectives & Use Cases**  
   - What triggers these notifications: price drops, limited availability, or promotions?  
   - Are we targeting all users or specific segments with these alerts?

2. **Notification Policies**  
   - Will these be real-time or batched periodically?  
   - Is there a frequency limit to avoid spamming users?

3. **User Consent & Preferences**  
   - Can users opt out of certain notifications (e.g., flight deals only)?  
   - How do we handle unsubscribes or manage notification settings?

4. **Cross-Functional Alignment**  
   - Are these notifications tied to marketing campaigns or purely event-driven?  
   - Which department sets the rules or controls the frequency/content?

---

### 3.2 Engineering

1. **System Architecture**  
   - Do we have a real-time feed of price changes, or do we poll price data periodically?  
   - Which channels are supported for notifications (push, SMS, email, in-app, etc.)?

2. **Queue & Event Management**  
   - Will we use a message queue system (e.g., Kafka, RabbitMQ) for real-time events?  
   - How do we handle delivery order and retries?

3. **User Subscription Logic**  
   - How does a user subscribe to specific routes/products/prices?  
   - Is subscription data stored in a dedicated table or integrated with user profiles?

4. **Data & Logging**  
   - How do we record notifications sent, opened, and clicked for analytics?  
   - Do we need a monitoring dashboard for real-time metrics on notification delivery?

---

### 3.3 System Design

1. **Notification Design & User Flow**  
   - Are push notifications deep-linked into the app to show relevant price details?  
   - Will in-app notifications be shown in a specific notification center or banner?

2. **User Preferences & Settings**  
   - Where can users customize notification types (price drops, last-minute deals, etc.)?  
   - Do we offer granular controls by category (bus, plane, hotel) or price range?

3. **Timing & Context**  
   - Should notifications be immediate or is there an optimal time window for better engagement?  
   - Do we block notifications at off-hours (e.g., 3 AM local time)?

4. **Interaction & Follow-Up**  
   - What happens if the user taps on a notification but the price has changed again?  
   - Do we show alternative options if the deal expires?
