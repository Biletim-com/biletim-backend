# 1. User Management

  1.1 View and Modify All User Content
  - Ability to view, edit, and delete all information related to registered users (site members).
  - Full administrative permissions to manage user accounts (personal info, roles, permissions, status).

# 2. Ticket/Hotel Management

  2.1 Transaction Search
  - Ability to search and view daily, weekly, or monthly transactions (bus/plane tickets and hotel reservations).

  2.2 Invoicing
  - View all invoice requests from customers related to ticket/hotel sales.
  - When an invoice is issued and uploaded to the system, an automatic email should be sent to the customer with the invoice attached or a download link.

  2.3 Refund Management
  - View all refund requests initiated by customers through the website.
  - View the balance transfer (refund) outcomes and status (e.g., pending, approved, completed).

# 3. Commission Management (Plane Tickets Only)

  3.1 Airline-Based Commission Settings
  - Commission applies only to plane tickets (not bus or hotel).
  - Commission rates depend on:
    - Airline (e.g., Airline A, Airline B, etc.)
    - Ticket Price Ranges (e.g., 0–100 USD, 101–200 USD, etc.)
    - Mobile app specific users
  - For each airline, configure default commission rates for one or more price ranges.
  - Ability to view, create, edit, or delete these commission rate configurations.
  - The system should calculate and apply the correct commission based on the airline and the price of the ticket at the time of sale.

notification duzenlendginde URL eklenecek kullanicilari yonlendirmek icin
Notification listesi icin UI calismasi (Bottom slider)

  3.2 Commission Updates
  - Admin can update commission rates/ranges at any time.

# 4. Content Management

  4.1 Announcements
  - Ability to manually manage announcements with the given fields.
    - Headline
    - start date
    - end date
    - Large screen image
    - mobile image
    - redirect url / where should users land when they open notifications
    - body with Content management format (didn't know how to describe it)
  - Manage banner images in the site’s slider/carousel.
  - Send email, SMS and push notifications(mobile application management) to all members about annoucements.

  4.2 Campaigns (needs deeper investigation)
  - Send email, SMS and push notifications to all members about campaigns.
  - Kampanya bildirimleri acildiginda biletleme ekranina gidilecek (Mobile app users)

  4.3 FAQs Management
  - Manage the FAQ (Frequently Asked Questions) section (create, edit, delete).

  4.4 Site Pages Management
  - Full access to edit, create, or delete all headings and subheadings on the site’s sub-pages.

# 5. Blog Management

  5.1 Blog Access and Editing
  - Manage blog posts on the website (create, edit, delete).
  - Upload images or media for blog posts.
  - It should be CMS style since blog posts may include images in the file dynamically.

# 6. Reports

  6.1 Revenue Reports
  - Filter by a specific date range to view both summary and detailed revenue information.
  - Commission-specific reports (e.g., total commission earned per airline, date range, etc.).
  - Export the data to Excel.

  6.2 Sales (Income) Reports
  - View daily, weekly, monthly, or a custom date range of summary and detailed income reports (number of tickets, total revenue, etc.).
  - Export the data to Excel.

  6.3 Invoice Reports
  - View daily, weekly, monthly, or a custom date range of issued invoices (summary and detailed).
  - Export the data to Excel.

# 7. Administrator Information

  7.1 Admin Profile
  - Ability to update personal admin profile details (e.g., name, email, password).
  - Ability to add new admin or user accounts with specific permissions.

# 7. Transcation Management
  - Admins can return Wallet deposits back to their customers after getting a call from the customer.
  - Admins must verify the transactions with customer spesific questions
  - Admin panelden yanlis yapilmis Wallet a iadeyi iptal edip, satin alinan karta iade yapilabilir.