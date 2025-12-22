# EthioAI Tourism Platform - Server

This is the backend/server-side code for the EthioAI Tourism Platform.

## Structure

```
server/
├── src/                    # Source code
├── config/                 # Configuration files
├── routes/                 # API routes
├── models/                 # Database models
├── middleware/             # Express middleware
├── utils/                  # Utility functions
├── tests/                  # Test files
├── package.json           # Dependencies
└── README.md              # This file
```

## Getting Started

```bash
cd server
npm install
npm run dev
```

## API Endpoints

- `/api/auth` - Authentication endpoints
- `/api/tours` - Tour management
- `/api/bookings` - Booking management
- `/api/payments` - Payment processing
- `/api/chat` - AI chat endpoints