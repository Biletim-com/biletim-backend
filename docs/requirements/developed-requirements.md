# Requirements Specification

## 1. Authentication

- **Sign-Up**:

  - Users provide their email address and password to create an account.
  - Password must meet security standards (e.g., minimum length, complexity).

- **Sign-Up Verification**:

  - Upon sign-up, a verification email is sent to the user's provided email address.
  - The email contains a unique verification code or link for account verification.

- **Account Verification**:

  - Users verify their account by entering the verification code sent to their email or clicking the provided verification link.

- **Google Login/Sign-Up**:

  - Users can sign in or create an account using their Google credentials through OAuth2.

- **Password Reset**:

  - Users can request a password reset by providing their email.
  - A password reset email with a unique, time-bound link or code is sent.
  - Users can reset their password by following the instructions in the email.

- **User Login**:
  - Users can log in with their email address and password.

---

## 2. User Page

- **Passengers**:

  - Users can register passengers for their own use in the purchase flow.
  - Passengers include credentials and ID details (e.g., ID numbers, passports).
  - Users can add, update, and delete passengers.

- **Saved Cards**:

  - Users can save cards in the system for faster payments, eliminating the 3DS step.
  - Users can delete their saved cards.

- **Wallet**:

  - Users can add money to their wallet using bank cards or saved cards.
  - Users can view a list of all transactions made using their wallet.

- **Invoice Details**:

  - Users can save invoice details for future reference.

- **Orders**:
  - Users can view a list of their upcoming or past orders.

---

## 3. Search and Purchase

### Bus Search and Purchase

- **Search**:

  - Users can list bus schedules based on:
    - **Departure Terminal**
    - **Arrival Terminal**
    - **Departure Date**
  - Only one-way trips are supported (no return trips).

- **Seat Selection**:

  - Users can select seats based on a visual representation of the bus layout.
  - Available, reserved, and occupied seats are visually distinguished.

- **User Details**:

  - Users provide:
    - Name
    - Surname
    - Other required details (e.g., contact number).

- **Invoice**:

  - Users can optionally provide invoice details during the booking process.

- **Payment**:

  - Users can pay using:
    - Bank card
    - Wallet
    - Saved card
  - **Payment Flow**:
    1. Users initiate payment.
    2. For bank card payments, 3DS authorization is required.
    3. Wallet and saved card payments do not require 3DS.
    4. Users receive a success or error message regarding the payment.

- **Post-Purchase**:
  - Users receive an email containing:
    - Trip details.
    - Seat information.
    - Other relevant booking details.

---

### Plane Search and Purchase

- **Search**:

  - Users can search for flight schedules based on:
    - **Departure Airport**
    - **Arrival Airport**
    - **Departure Date**
    - **Return Date** (optional for round trips).
    - **Passenger Details** (number of passengers).

- **Selection**:

  - Users select a flight and a package (e.g., Economy, Business, Premium).

- **User Details**:

  - Users provide:
    - Name
    - Surname
    - ID Number (mandatory for booking).
    - Contact Details (phone, email, etc.).

- **Invoice**:

  - Providing invoice details is mandatory for plane tickets.

- **Payment**:

  - Users can pay using:
    - Bank card
    - Wallet
    - Saved card
  - **Payment Flow**:
    1. Users initiate payment.
    2. For bank card payments, 3DS authorization is required.
    3. Wallet and saved card payments do not require 3DS.
    4. Users receive a success or error message regarding the payment.

- **Post-Purchase**:
  - Users receive an email containing:
    - Ticket details.
    - A ticket attachment in PDF format.

---

### Hotel Search and Purchase _(Requires Testing)_

- **Search**:

  - Users can search for hotels based on:
    - **Hotel Name** or **Region**.
    - Number of Guests.
    - Check-In and Check-Out Dates.

- **Selection**:

  - Users can:
    - Select a region.
    - Choose a specific hotel.
    - Select a room from available options.

- **User Details**:

  - Users provide guest details, including:
    - Names of all guests.
    - Other required booking details.

- **Invoice**:

  - Providing invoice details is mandatory for hotel bookings.

- **Payment**:

  - Users can pay using:
    - Bank card
    - Wallet
    - Saved card
  - **Payment Flow**:
    1. Users initiate payment.
    2. For bank card payments, 3DS authorization is required.
    3. Wallet and saved card payments do not require 3DS.
    4. The system processes the payment (email templates for confirmation are unavailable).

- **Post-Purchase**:
  - No email or confirmation is sent to the user after purchase.

---

## 4. Order Return

- **Initiation**:

  - Users provide:
    - PNR Number (for bus or plane tickets).
    - Hotel Reservation Number (for hotel bookings).

- **Verification**:

  - Users receive a text message containing a verification code.
  - Users enter the verification code to confirm the cancellation process.

- **Refund**:
  - The order is canceled, and a refund process is initiated based on the payment method.
  - Users can transfer the refunded amount for hotel bookings into their wallet.

---

## Additional Notes

- **All payments are processed through VakıfBank VPOS.**
- The entire hotel flow, wallet transactions, and saved card payments need to be tested before deployment to the production environment.
