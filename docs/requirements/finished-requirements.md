# Requirements Specification

## 1. Authentication

- **Sign-Up**:
  - User provides their email address and password to create an account.
  - Password must meet security standards (e.g., minimum length, complexity).
- **Sign-Up Verification**:

  - Upon sign-up, a verification email is sent to the user's provided email address.
  - The email contains a unique verification code or link for account verification.

- **Account Verification**:

  - User verifies their account by entering the verification code sent to their email or clicking the provided verification link.

- **Google Login/Sign-Up**:

  - Users can sign in or create an account using their Google credentials through OAuth2.

- **Password Reset**:

  - Users can request a password reset by providing their email.
  - A password reset email with a unique, time-bound link or code is sent.
  - Users can reset their password by following the instructions in the email.

- **User Login**:
  - Users can login with their email address and password.

---

## 2. User Settings

- **Passengers**:
  - Users can register passengers for themself to use in the purchase flow
  - Paggengers have their credentials and ID details (ID number, passports)
  - Users can add, update and delete passengers

---

- **Saved Cards**:

  - Users can register save cards in the system for a faster payment process which eliminates the 3DS step
  - Users can delete their saved cards

- **Orders**:
  - Users can list their upcoming or past orders

---

## 3. Search and Purchase

### Bus Search and Purchase

- **Search**:
  - Users can list bus schedules based on:
    - **Departure Terminal**
    - **Arrival Terminal**
    - **Departure Date**
  - One-way trips only (no return trips).
- **Seat Selection**:

  - Users select seats based on a visual representation of the bus layout.
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
  - **Payment flow**:
    1. User initiates payment.
    2. System redirects the user to a 3DS (Three-Domain Secure) authorization page.
    3. After 3DS authorization, the user receives a success or error message.

- **Post-Purchase**:
  - Users receive an email containing:
    - Trip details.
    - Seat information.
    - Other relevant booking details.

---

### Plane Search and Purchase

- **Search**:

  - Users can search for flight schedules by specifying:
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
  - **Payment flow**:
    1. User initiates payment with a bank card.
    2. System redirects the user to a 3DS authorization page.
    3. User receives a success or error message.

- **Post-Purchase**:
  - Users receive an email with:
    - Ticket details.
    - A ticket attachment in PDF format.

---

### Hotel Search and Purchase _(Requires UAT Testing)_

- **Search**:

  - Users search for hotels by:
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
  - **Payment flow**:
    1. User initiates payment with bank card details.
    2. System processes payment without sending an email (email template for this is unavailable).

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

- **Cancellation**:
  - The order is canceled, and a refund process is initiated based on the payment method.

---

## Additional Notes

- **All payments are processed through VakıfBank VPOS.**
