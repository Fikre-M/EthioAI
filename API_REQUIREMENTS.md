# API Requirements for Backend Team

## Overview
This document specifies the API endpoints required by the frontend application.

---

## Base URL
```
Development: http://localhost:3000/api
Production: https://api.ethioai-tourism.com/api
```

---

## Authentication

All protected endpoints require JWT token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Endpoints Required

### 1. GET /api/users/:id
**Purpose:** Retrieve user profile information

**Authentication:** Required

**Path Parameters:**
- `id` (string) - User ID

**Response 200:**
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john@example.com",
  "emailVerified": true,
  "avatar": "https://cdn.example.com/avatars/user123.jpg",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-12-06T14:20:00Z",
  "preferences": {
    "notifications": true,
    "marketing": false
  }
}
```

**Error Responses:**
```json
// 401 Unauthorized
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}

// 404 Not Found
{
  "error": "Not Found",
  "message": "User not found"
}
```

**Frontend Usage:**
```typescript
// src/services/userService.ts
const user = await userService.getProfile(userId)
```

---

### 2. PUT /api/users/:id
**Purpose:** Update user profile information

**Authentication:** Required

**Path Parameters:**
- `id` (string) - User ID

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.new@example.com",
  "preferences": {
    "notifications": true,
    "marketing": false
  }
}
```

**Validation Rules:**
- `name`: Required, 2-100 characters, alphanumeric + spaces
- `email`: Required, valid email format, unique
- `preferences.notifications`: Optional, boolean
- `preferences.marketing`: Optional, boolean

**Response 200:**
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "john.new@example.com",
  "emailVerified": false,
  "avatar": "https://cdn.example.com/avatars/user123.jpg",
  "updatedAt": "2024-12-06T14:25:00Z",
  "preferences": {
    "notifications": true,
    "marketing": false
  }
}
```

**Error Responses:**
```json
// 400 Bad Request
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": {
    "email": "Email format is invalid"
  }
}

// 401 Unauthorized
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}

// 403 Forbidden
{
  "error": "Forbidden",
  "message": "Cannot update another user's profile"
}

// 409 Conflict
{
  "error": "Conflict",
  "message": "Email address already in use"
}
```

**Frontend Usage:**
```typescript
// src/services/userService.ts
const updatedUser = await userService.updateProfile(userId, {
  name: "New Name",
  email: "new@email.com"
})
```

**Notes:**
- If email is changed, set `emailVerified` to `false`
- Send verification email when email changes
- Only allow users to update their own profile (check JWT token)

---

### 3. PUT /api/users/:id/avatar
**Purpose:** Upload and update user profile avatar

**Authentication:** Required

**Path Parameters:**
- `id` (string) - User ID

**Content-Type:** `multipart/form-data`

**Request Body (Form Data):**
```
avatar: [File]
```

**File Requirements:**
- **Formats:** JPEG, PNG, WebP
- **Max Size:** 5MB (5,242,880 bytes)
- **Recommended:** Square image, minimum 200x200px
- **Processing:** Resize to 400x400px, optimize quality

**Response 200:**
```json
{
  "id": "user123",
  "avatar": "https://cdn.example.com/avatars/user123.jpg",
  "updatedAt": "2024-12-06T14:30:00Z"
}
```

**Error Responses:**
```json
// 400 Bad Request - Invalid file
{
  "error": "Bad Request",
  "message": "Invalid file format. Allowed: JPEG, PNG, WebP"
}

// 401 Unauthorized
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}

// 403 Forbidden
{
  "error": "Forbidden",
  "message": "Cannot update another user's avatar"
}

// 413 Payload Too Large
{
  "error": "Payload Too Large",
  "message": "File size exceeds 5MB limit"
}
```

**Frontend Usage:**
```typescript
// src/services/userService.ts
const file = event.target.files[0]
const updatedUser = await userService.updateAvatar(userId, file)
```

**Implementation Notes:**
- Use multer or similar for file upload handling
- Store files in cloud storage (AWS S3, Cloudinary, etc.)
- Generate unique filename (e.g., `user123_1234567890.jpg`)
- Delete old avatar when uploading new one
- Resize and optimize image server-side
- Return CDN URL in response

**Example Backend Code (Node.js/Express):**
```javascript
const multer = require('multer')
const sharp = require('sharp')
const { S3Client } = require('@aws-sdk/client-s3')

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  }
})

router.put('/users/:id/avatar', 
  authenticate, 
  upload.single('avatar'), 
  async (req, res) => {
    // Process and upload to S3
    const buffer = await sharp(req.file.buffer)
      .resize(400, 400)
      .jpeg({ quality: 90 })
      .toBuffer()
    
    // Upload to S3 and get URL
    const avatarUrl = await uploadToS3(buffer, req.params.id)
    
    // Update user in database
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatar: avatarUrl },
      { new: true }
    )
    
    res.json({
      id: user.id,
      avatar: user.avatar,
      updatedAt: user.updatedAt
    })
  }
)
```

---

## Existing Endpoints (Already Implemented)

### POST /api/auth/login
**Status:** ✅ Frontend Ready

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

---

### POST /api/auth/register
**Status:** ✅ Frontend Ready

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

---

### POST /api/auth/forgot-password
**Status:** ✅ Frontend Ready

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Password reset email sent"
}
```

---

### GET /api/auth/me
**Status:** ✅ Frontend Ready

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "user123",
  "name": "John Doe",
  "email": "user@example.com",
  "emailVerified": true,
  "avatar": "https://cdn.example.com/avatars/user123.jpg"
}
```

---

## Database Schema

### User Model
```typescript
interface User {
  id: string                    // Primary key
  name: string                  // Full name
  email: string                 // Email (unique)
  password: string              // Hashed password
  emailVerified: boolean        // Email verification status
  avatar?: string               // Avatar URL (optional)
  createdAt: Date              // Account creation date
  updatedAt: Date              // Last update date
  preferences: {
    notifications: boolean      // Email notifications enabled
    marketing: boolean          // Marketing emails enabled
  }
}
```

**Indexes:**
- `email` (unique)
- `id` (primary key)

---

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": {
    "field": "Specific error for this field"
  }
}
```

### HTTP Status Codes
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate email)
- `413 Payload Too Large` - File too large
- `500 Internal Server Error` - Server error

---

## Security Requirements

### JWT Token
- Algorithm: HS256 or RS256
- Expiration: 7 days
- Include user ID in payload
- Sign with secret key

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- Hash with bcrypt (10 rounds)

### Rate Limiting
- Login: 5 attempts per 15 minutes per IP
- Register: 3 attempts per hour per IP
- Password reset: 3 attempts per hour per email
- Profile update: 10 requests per minute per user
- Avatar upload: 5 uploads per hour per user

### CORS Configuration
```javascript
{
  origin: [
    'http://localhost:5173',  // Development
    'https://ethioai-tourism.com'  // Production
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

---

## Environment Variables

### Required
```env
# Server
PORT=3000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/ethioai

# JWT
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# AWS S3 (or alternative storage)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=ethioai-avatars

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@ethioai-tourism.com
SMTP_PASS=your-app-password
EMAIL_FROM=EthioAI Tourism <noreply@ethioai-tourism.com>

# Frontend URL (for CORS and email links)
FRONTEND_URL=https://ethioai-tourism.com
```

---

## Testing

### Test Cases for Each Endpoint

#### GET /api/users/:id
- [ ] Returns user data for valid ID
- [ ] Returns 401 for missing token
- [ ] Returns 401 for invalid token
- [ ] Returns 404 for non-existent user
- [ ] Returns 403 when accessing other user's profile

#### PUT /api/users/:id
- [ ] Updates user data successfully
- [ ] Returns 400 for invalid email format
- [ ] Returns 409 for duplicate email
- [ ] Returns 401 for missing token
- [ ] Returns 403 when updating other user's profile
- [ ] Sets emailVerified to false when email changes
- [ ] Validates name length (2-100 chars)

#### PUT /api/users/:id/avatar
- [ ] Uploads avatar successfully
- [ ] Returns 400 for invalid file type
- [ ] Returns 413 for file too large
- [ ] Returns 401 for missing token
- [ ] Returns 403 when updating other user's avatar
- [ ] Deletes old avatar when uploading new one
- [ ] Resizes image to 400x400px
- [ ] Returns CDN URL in response

---

## Postman Collection

### Import this collection for testing:

```json
{
  "info": {
    "name": "EthioAI Tourism API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get User Profile",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/users/:id",
          "host": ["{{baseUrl}}"],
          "path": ["users", ":id"],
          "variable": [
            {
              "key": "id",
              "value": "user123"
            }
          ]
        }
      }
    },
    {
      "name": "Update User Profile",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"name\": \"John Doe\",\n  \"email\": \"john@example.com\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/users/:id",
          "host": ["{{baseUrl}}"],
          "path": ["users", ":id"],
          "variable": [
            {
              "key": "id",
              "value": "user123"
            }
          ]
        }
      }
    },
    {
      "name": "Update User Avatar",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "avatar",
              "type": "file",
              "src": "/path/to/avatar.jpg"
            }
          ]
        },
        "url": {
          "raw": "{{baseUrl}}/users/:id/avatar",
          "host": ["{{baseUrl}}"],
          "path": ["users", ":id", "avatar"],
          "variable": [
            {
              "key": "id",
              "value": "user123"
            }
          ]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "token",
      "value": "your-jwt-token-here"
    }
  ]
}
```

---

## Timeline

### Priority 1 (Week 1)
- [ ] GET /api/users/:id
- [ ] PUT /api/users/:id

### Priority 2 (Week 2)
- [ ] PUT /api/users/:id/avatar
- [ ] File upload infrastructure
- [ ] Cloud storage setup

### Priority 3 (Week 3)
- [ ] Email verification flow
- [ ] Password reset flow
- [ ] Rate limiting

---

## Support

For questions or clarifications:
- Frontend Team: [Contact]
- Backend Team: [Contact]
- Documentation: See `DELIVERABLES_SUMMARY.md`

---

**Document Version:** 1.0  
**Last Updated:** December 6, 2025  
**Status:** Ready for Implementation
