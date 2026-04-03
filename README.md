# GBU Alumni Portal - Server

This repository contains the backend server for the GBU Alumni Portal. It is a Node.js and Express application responsible for managing user data, authentication, event information, and payment processing. The server is designed to be deployed on Vercel.

## Features

- **Role-Based Access Control**: Three distinct user roles with specific permissions: Admin, Sub-Admin, and Alumni.
- **Secure Authentication**: JWT-based authentication using `httpOnly` cookies for managing sessions. Includes signup, login, logout, and secure password reset via email.
- **Alumni Management**: A complete workflow for alumni, including registration with degree document uploads, verification by sub-admins, profile management, and viewing their digital alumni card.
- **Admin & Sub-Admin Panels**: Endpoints for administrators to manage sub-admins, schools, and alumni. Sub-admins have the authority to approve or reject new alumni registrations.
- **Payment Integration**: Integrated with PayU to handle one-time membership fees. Includes request and response hash verification for transaction security.
- **Event Management**: CRUD functionality for creating, viewing, updating, and deleting university events.
- **School & Programme Management**: Endpoints for admins to dynamically manage schools, programmes, and branches within the university structure.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT), bcrypt
- **Payments**: PayU
- **File Uploads**: Multer
- **Email Service**: Nodemailer
- **Middleware**: CORS, Express Rate Limit

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm
- A running MongoDB instance (local or cloud-based)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/harshuh/alumni-server.git
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd alumni-server
    ```

3.  **Install NPM packages:**
    ```sh
    npm install
    ```

4.  **Set up environment variables:**
    Create a `.env` file in the root directory by copying the example file.
    ```sh
    cp .env.example .env
    ```
    Then, fill in the necessary values in your new `.env` file. See the [Configuration](#configuration) section for details.

5.  **Start the server:**
    ```sh
    npm start
    ```
    The server will start running on the port specified in your `.env` file (default is `1100`).

## Configuration

The following environment variables need to be set in the `.env` file.

| Variable                | Description                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| `PORT`                  | The port the server will run on.                                         |
| `URL`                   | Your MongoDB connection string.                                          |
| `JWT_SECRET`            | Secret key for general-purpose JWTs (e.g., password reset).              |
| `ADMIN_JWT_SECRET`      | Secret key for Admin authentication tokens.                              |
| `SUBADMIN_JWT_SECRET`   | Secret key for Sub-Admin authentication tokens.                          |
| `ALUMNI_JWT_SECRET`     | Secret key for Alumni authentication tokens.                             |
| `EMAIL`                 | Email address for sending notifications via Nodemailer (e.g., Gmail).    |
| `EMAIL_CREDS`           | App password for the email account.                                      |
| `PayU_MERCHENT_KEY`     | Your PayU Merchant Key.                                                  |
| `PayU_MERCHENT_SALT_V2` | Your PayU Salt (Version 2).                                              |
| `SURL`                  | Your application's URL to handle successful PayU payments.               |
| `FURL`                  | Your application's URL to handle failed PayU payments.                   |
| `ENVIRONMENT_TEST`      | The PayU gateway URL (e.g., `https://test.payu.in/_payment`).            |

## API Endpoints

The API is structured with versioning and role-based access.

### Authentication

-   `POST /api/root/login`: Admin login.
-   `POST /api/subadmin/login`: Sub-Admin login.
-   `POST /api/alumni/login`: Alumni login.
-   `POST /api/alumni/register`: Alumni registration. Requires `multipart/form-data` with user details and degree image.
-   `POST /api/alumni/forgot-password`: Send a password reset link to the alumni's email.
-   `POST /api/alumni/forgot-password/reset/:token`: Reset password using the token from the email.
-   `POST /api/root/logout`: Admin logout.
-   `POST /api/subadmin/logout`: Sub-Admin logout.
-   `POST /api/alumni/logout`: Alumni logout.

### Admin & Sub-Admin Operations

-   `POST /api/root/signup`: Create a new Admin (Admin access required).
-   `POST /api/subadmin/signup`: Create a new Sub-Admin (Admin access required).
-   `GET /api/panel/view-subadmins`: Get a list of all Sub-Admins (Admin access required).
-   `DELETE /api/panel/delete-subadmin/:username`: Delete a Sub-Admin (Admin access required).
-   `PATCH /api/panel/toggle/:username`: Activate or deactivate a Sub-Admin account (Admin access required).
-   `GET /api/panel/activeUsers`: Get a list of all verified and paid alumni (Sub-Admin access required).
-   `GET /api/panel/admin/activeUsers`: Get a list of all verified and paid alumni (Admin access required).
-   `DELETE /api/panel/delete-alumni/:enrollmentNo`: Delete an alumni account (Admin access required).

### Alumni Verification

-   `GET /api/approval/pending-users`: Get a list of alumni pending verification (Sub-Admin access required).
-   `GET /api/approval/approved-users`: Get a list of approved alumni who have not yet paid (Sub-Admin access required).
-   `POST /api/approval/approve-user/:enrollmentNo`: Approve an alumni registration (Sub-Admin access required).
-   `DELETE /api/approval/reject-user/:enrollmentNo`: Reject and delete an alumni registration request (Sub-Admin access required).

### Alumni Profile

-   `GET /api/alumni/profile`: Get the logged-in alumni's profile details.
-   `GET /api/alumni/profile/card`: View the logged-in alumni's digital card details.
-   `PUT /api/alumni/profile/update`: Update alumni profile (social links, bio, profile picture).
-   `POST /api/alumni/profile/change-password`: Change the logged-in alumni's password.

### School & Event Management

-   `POST /api/school/add`: Add a new school, programme, and branch (Admin access required).
-   `GET /api/school/`: Get a list of all schools.
-   `POST /api/events/`: Create a new event.
-   `GET /api/events/`: Get a list of all events.
-   `PUT /api/events/:id`: Update an existing event.
-   `DELETE /api/events/:id`: Delete an event.

### Payments (PayU)

-   `POST /api/payment/initiate-payment`: Generate hash and parameters to start a payment transaction.
-   `POST /api/payment/success`: Callback endpoint for successful payments from PayU.
-   `POST /api/payment/failure`: Callback endpoint for failed payments from PayU.

## Project Structure

```
.
├── app/            # Main server entry point
├── config/         # Database connection, CORS settings
├── controllers/    # Business logic for routes
├── middlewares/    # Express middlewares (auth, file uploads, rate limiting)
├── models/         # Mongoose schemas for MongoDB collections
├── routes/         # API route definitions
├── uploads/        # Directory for user-uploaded files (degrees, profile pictures)
├── utils/          # Helper functions (hashing, date formatting)
└── vercel.json     # Vercel deployment configuration
