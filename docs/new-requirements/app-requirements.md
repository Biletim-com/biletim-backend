# Biletim Functional Requirements

## 1. Introduction
**1.1 Purpose**  
Provide a comprehensive list of functional requirements for the Biletim application, focusing on **bus ticket**, **plane ticket**, and **hotel reservation** functionalities, along with **payment**, **wallet**, **user registration**, and **returns** processes.  

**1.2 Scope**  
- The requirements outlined here cover the **front-end** and **back-end** functionality related to user interactions (registration, searches, purchases, returns, etc.).  
- All non-functional requirements (e.g., performance, security, scalability) are **out of scope** for this document but should be considered separately.  

---

## 2. User Account Management
### 2.1 Login/Registration Methods
1. **Email**  
   - Users login/register using a valid email address.
2. **Google (Gmail)**  
   - Users login/register using their Google account.
3. **Facebook**  
   - Users login/register using their Facebook account.
4. **Apple**  
   - Users login/register using their Apple account.

### 2.2 Requirements
- System must allow users to login with any of the above login methods.
- System must allow new users to choose any of the above registration methods.  
- System must store and validate user credentials accordingly.  
- System must provide error handling for invalid or failed logins/registrations.  
- System must allow users to **reset** their passwords (Forgotten Password)

---

## 3. User Profile and Preferences
### 3.1 Settings
- Users can update their credentials.
  - firstname
  - lastname
  - email address
  - tc number (not mandatory for foreigners)
  - phone number
  - birthday
  - gender (male, female)
- Users can manage their passports.
- Users can add their THY mile cards.
- Users can **update** their passwords (Update Password)

### 3.2 Passengers
- Users can list their passengers.
- Users can delete their passengers,
- Users can update their passengers.
- Users can save passengers with the following credentials.
  - firstname
  - lastname
  - email address
  - tc number (not mandatory for foreigners)
  - phone number
  - birthday
  - gender (male, female)
- Users can manage passenger passports.
- Users can manage passenger THY mile cards.

### 3.3 My Travels
- Users can list their bus/plane/hotel travels/visits.
- Users can filter their travels/visits based on "upcoming", "past", "returned" and "cancelled" filters.
- Users can see the details of the "upcoming" travels/visits.
  - Q1. What is the UI/UX of an MyTravel upcoming travel/visit in the User Profile page

### 3.4 Saved Payment Cards
- Users can list the saved cards.
- Users can delete their saved cards.
- Users can save credit/debit cards by providing the following fields.  
  - name of the card (dynamic)
  - card number
  - exp date
  - name on the card
  - cvv number
- System must authorize the user with 3DS.
- System must create tokens both for VakifBank and GarantiBank VPOSes.
- Questions:
  - Q: **Investigate with the bank how to save the card numbers in order to initiate the VAKIFBANK 3DS screen??**

### 3.5 Invoice Addresses
- Users can list invoice info.
- Users can update an invoice info.
- Users can delete an invoice info
- Users can create different types of invoice info with the given fields (all is mandatory):
  - Personal
    - firstname
    - lastname
    - tc number
    - email
    - country
    - city
    - district (ilce)
    - address
  - Proprietorship (sahis sirketi)
    - firstname
    - lastname
    - tc number
    - email
    - country
    - city
    - district (ilce)
    - address
  - Company
    - company name
    - tax office
    - tax ID
    - email
    - country
    - city
    - district (ilce)
    - address
  - Questions:
    - Q: Which fields are used for foreign personal invoices?
    - Q: Which fields are used for foreign proprietorships?
    - Q: Which fields are used for foreign companies?

### 3.6 Favorite Destinations
- Users have favorite destinations saved as shortcut while looking for tickets.
- Users can list favorite destinations.
- Users can delete favorite destinations.
- Questions:
  - Q: How do users save favorite destionations?

### 3.7 Wallet (BiletimGo)
- Users have an **online wallet** to hold virtual currency (biPara).
- Users see the their current balance.
- Users can deposit money from their bank cards and saved cards.
- Users can convert their CardBonuses into BiPara
- Users can list the transactions history of their BiletimGo card within a date range.
- Users can return deposits back to their bank cards by calling the call center.
- Users can convert gift cards into biPara. **(next phases)**

---

## 4. Wallet (BiletimGo) and Money (biPara)
### 4.1 Deposit
- Users can **deposit money** to their wallet from a normal bank or credit card.
- System must process deposits and reflect the updated balance in real-time.
- Users can deposit max **75000 TL** to their wallet.
- Questions:
  - Q2: UX to convert CardBonuses into BiPara.

### 4.2 Card Bonuses Conversion
- Users can **convert their card bonuses** (e.g., from credit card loyalty points) into the wallet as biPara.
- **Expiration Rule**: Bonus credits converted to biPara expire **after one year**.

### 4.3 Refund
- Users can **refund wallet deposits** back to their bank account via calling the call center.
- **Restriction**: CardBonus-derived amounts **cannot be refunded**.

---

## 5. Bus Ticket Search & Selection
### 5.1 Search Parameters
- Departure **city/terminal**  
- Arrival **city/terminal**  
- **Date** of travel  

### 5.2 Search Results
- System must display available buses matching the search criteria.
- Users must be able to **select a bus trip** based on schedule and price.

### 5.3 Bus features
- Users must be able to **see bus's available features** on the selected bus.

### 5.4 Seat Selection
- Users must be able to **view available seats** on the selected bus.
- Users must be able to **select their preferred seat(s)** before checkout.
- Users must be able to **see total price** before checkout.

### 5.5 Result Filtering
- Users can filter based on the followings: 
  - seat arrangement types (2+1, 2+2).
  - travel time. (Morning, Afternoon, Evening).
  - ticket price.
  - companies.
  - departure terminals.
  - arrival terminals.
  - bus's features.

### 5.6 Pre Payment
- Users must provide the following contact details:
  - phone number
  - email address
- Users must provide the following details per guest:
  - firstname
  - lastname
  - birthday
  - gender (male, female)
  - nationality
  - tcnumber (if applicable)
  - passport number (for foreigners)
  - passport expiration date (for foreigners)
- Users must provide invoice details or select from the existing ones (if it is for a company)
  - NOTE: See the invoice section in the users page

---

## 6. Plane Ticket Search & Selection
### 6.1 Search Parameters
- Departure **city/airport**  
- Arrival **city/airport**  
- **Date** of travel  
- **Flight Class**, classified by:
  - Economy
  - Business
- **Travel Type**, classified by:
  - Oneway
  - Roundtrip
- **Number of passengers**, classified by:
  - Adult
  - Baby
  - Child
  - Elderly

### 6.2 Search Results
- System must display available flights matching the search criteria.
- Users must be able to **select a flight** based on schedule and price.

### 6.3 Flight Details
- User can see the flight details including
  - Airline company name
  - Flight number (which belongs to the airline company)
  - FLight starting and end time together with Airports
  - Flight duration
  - Lagguage details

### 6.4 Package Selection
- Users can select one of the presented available packages.
- Users are able to see details and the price of the packages including the name and the features.

### 6.5 Result Filtering
- Users can filter based on the followings: 
  - connecting flight.
  - price.
  - lagguage type (cabin or normal baggage).
  - departure time (Morning, Afternoon, Evening).
  - arrival time (Morning, Afternoon, Evening).
  - lagguage type (cabin or normal baggage).
  - companies.
  - departure airport.
  - arrival airport.

### 6.6 Pre Payment
- Users must provide the following contact details:
  - phone number
  - email address
- Users must provide the following details per guest:
  - firstname
  - lastname
  - birthday
  - gender (male, female)
  - nationality
  - tcnumber (if applicable)
  - passport number (for foreigners and international flights)
  - passport expiration date (for foreigners and international flights)
- Users must provide invoice details or select from the existing ones (if it is for a company)
  - NOTE: See the invoice section in the users page

---

## 7. Hotel Search & Reservation
### 7.1 Search Parameters
- **Hotel name** or **hotel location**  
- **Check-in** and **check-out** dates  
- **Number of guests** and **Number of rooms**

### 7.2 Search Results
- System must display a list of available hotels with the following details.
  - pricing
  - location
  - features
  - number of comments
  - users' overall rate
- Users must be able to **select a hotel** from the search results.

### 7.3 Search Result Filtering
- Users can filter based on the followings: 
  - price.
  - region (Kas, Alanya, Kemer).
  - pansion type.
  - user rates.
  - reservation type (Free cancellation etc).
  - lagguage type (cabin or normal baggage).
  - theme (theme of the hotel if available).
  - features (Wifi, Free meal, Spa etc).

### 7.4 Hotel Details
- System must display the followings: 
  - available **room types** (based on the search parameters).
  - facility information (general info, meals, anameties, etc)
  - location in the map
  - user comments and rates


### 7.5 Room Selection
- Users must be able to **select room(s)** and proceed to reservation.
- Questions:
  - Q: Couldn't spot the room selection option in the API. How users select their rooms during the bookin process

### 7.6 Pre Payment
- Users must provide the following contact details:
  - phone number
  - email address
- Users must provide the following details per guest:
  - firstname
  - lastname
  - birthday
  - gender (male, female)

---

## 8. Purchase & Payment
### 8.1 Payment Methods
- **BiletimGo (biPara)**
- **Bank Card** (new or saved) via **VakifBank** and **GarantiBank** VPOS
  - System must use GarantiBank VPOS for GarantiBank cards and VakifBank VPOS for the rest.
- **Partial Payment** with wallet + bank card or saved card (**Cancelled**).
- System only supports payments with **TL**

### 8.2 Card Installments
- Users can **buy tickets with installments** (taksitli satış).
- System must calculate and display the **installment plan** for the user. (using VakifBank and GarantiBank)

### 8.3 Confirmation & Notifications
- After purchase, users receive **SMS** and **email** confirmations.
  - Bus -> SMS and Email.
  - Plane -> SMS, Email and Ticket attachment.
  - Hotel -> SMS, Email and Booking attachment.
- **Notification Content**: Must vary depending on **bus**, **plane**, or **hotel** purchase.
- System sends the original invoice after the purchase using external **Parasut** APIs.

---

## 9. Returns (Ticket/Reservation Cancellations)
### 9.1 Initiation
- Users can't initiate checked-in tickets.
- Users can initiate a return process by calling:  **0850 244 2586**. person here will guide them throught the following cancellation process.
- Users can initiate a return process using:
  - **PNR number** (for bus or plane)
  - **Hotel reservation number** (for hotel)
- System must validate the provided reference number.

### 9.2 SMS Verification
- Users receive an **SMS** containing a verification code.
- Users must input this code to proceed with the return request.

### 9.3 Penalty & Service Fee
- Users **pay penalty** fees as required by the provider.
- **Service fee** is **not refunded**.
- **Additional Service fee** is **not refunded**.

### 9.4 Confirmation & Notifications
- Users receive **SMS** and **email** after the return is processed.
- The **message content** must differ for bus, plane, or hotel purchases.

### 9.4 Refunds  
Refunds are processed as follows:  
- Users can choose to receive the refund in one of the following ways:  
  1. **Refund to the original payment methods.**
  2. **Refund the full amount to the wallet** – Users can choose to have the entire refund credited to their wallet, regardless of the original payment method.  

---

## 10. Additional Services (Plane Tickets)
- Users must get the following details in their email ticket attachment
- Plane tickets involve these external services will be processed via: (pending discussion)
  - Bank card
  - Wallet (cancelled)
  - Saved Cards
- Questions:
  - Q: contact **tamamliyo** people to confirm the payment flow as we dont want the customers to see multiole transactions in the banl account!!!!
### 10.1 Travel Insurance (next phases)
- Users can purchase **travel insurance** when buying plane tickets.
- The external API will provide the price list and process the payment in the backgound.

### 10.2 BiletimGuvende
- Allows ticket returns **without a reason** up to **3 hours** before departure.
- Must be purchased **during the initial ticket purchase** process.
- The external API will provide the price list and process the payment in the backgound.

### 10.3 IadeJet (pending confirmation)
- Allows **fast return** processing if the flight is canceled by the airline.
- Return requests with iadeJet may require **call center** involvement.
- Airline cancellation cause must be **investigated** before processing.
- Users pay extra 20 TL per person.

---

## 11. Check-In
- Users are **redirected** to the airline’s website after providing the **PNR number**.
- System must provide clear instructions for completing the check-in on the airline’s site.


## 12. Mobile App
- Mobile application has the same requirements except for:
  - mobile-app-specific plane ticket commission rates.
  - mobile-app-user-specific push notifications.