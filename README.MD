# Event Reminder API

Don’t miss an event again, a secure REST API for managing events and delivering scheduled email reminders Built with Node.js, Express, and MongoDB.

## Features

- Automated Email Reminders
- User Authentication
- Secure API with Rate Limiting
- CRUD Operations for Events

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Nodemailer
- JWT Authentication
- Agenda.js

## API Endpoints

### Authentication

```http
POST /api/v1/users/signup              # Register new user
POST /api/v1/users/login               # Login user
POST /api/v1/users/forgotPassword      # Reset password request
PATCH /api/v1/users/resetPassword/:token  # Reset password
```

### Events

```http
GET    /api/v1/events        # Get all events (requires authentication)
POST   /api/v1/events        # Create new event with reminder (requires authentication)
GET    /api/v1/events/:id    # Get specific event (requires authentication)
PUT    /api/v1/events/:id    # Update event (requires authentication)
DELETE /api/v1/events/:id    # Delete event (requires authentication)
```

## Installation

1. Clone the repository:

```bash
git clone [your-repo-url]
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in config folder:

```env
PORT=4000
DB_CONNECTION=your_mongodb_uri
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_email_app_password
JWT_SECRET=your_jwt_secret
```

4. Start the server:

```bash
npm start
```

## API Documentation

### Create User

```http
POST /api/v1/users/signup
{
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123",
    "passwordConfirm": "password123"
}
```

### Login

```http
POST /api/v1/users/login
{
    "email": "user@example.com",
    "password": "password123"
}
```

### Create Event

```http
POST /api/v1/events
{
    "title": "Event Title",
    "description": "Event Description",
    "startDate": "2024-04-25 14:00:00",
    "endDate": "2024-04-25 15:00:00",
    "timeZone": "Asia/Baghdad",
    "status": "confirmed"
}
```

## Authentication Note

All event endpoints require authentication. Include the JWT token in your request headers:

```
Authorization: Bearer your_jwt_token
```

## Error Handling

The API includes comprehensive error handling for various scenarios including:
- Invalid authentication tokens
- Expired tokens
- Missing required fields
- Database errors
- Rate limiting

### Security Considerations

- Passwords are hashed using bcrypt before being stored in the database.
- JWT tokens are used for authentication and are signed with a secret key.
- All sensitive information, such as the database URI, email credentials, and JWT secret, is stored in environment variables.
- Rate limiting is enabled to protect against brute-force and DDoS attacks.
