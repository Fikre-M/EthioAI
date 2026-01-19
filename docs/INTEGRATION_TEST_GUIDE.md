# 🧪 Integration Testing Guide

## ✅ **System Status**

### **Servers Running**
- ✅ **Backend**: http://localhost:5000 (Express + TypeScript + Prisma)
- ✅ **Frontend**: http://localhost:3001 (React + Vite + TypeScript)
- ✅ **Database**: MySQL on localhost:3307

### **Configuration Applied**
- ✅ CORS configured for port 3001
- ✅ Environment variables set correctly
- ✅ Auth token interceptor active
- ✅ All auth endpoints implemented

---

## 🎯 **Testing Checklist**

### **1. Health Check** ✅
```bash
curl http://localhost:5000/health
```
**Expected Response**:
```json
{
  "status": "OK",
  "message": "EthioAI Tourism Server is running",
  "timestamp": "2026-01-14T...",
  "environment": "development"
}
```

---

### **2. User Registration Flow**

#### **Step 1: Open Application**
- Navigate to: **http://localhost:3001**
- You should see the EthioAI Tourism Platform homepage

#### **Step 2: Click Sign Up**
- Look for "Sign Up" button in the header (top-right)
- Click to open registration form

#### **Step 3: Fill Registration Form**
- **Name**: Test User
- **Email**: test@example.com
- **Password**: Test123!
- **Confirm Password**: Test123!

#### **Step 4: Submit Form**
- Click "Sign Up" button
- Watch for loading state

#### **Expected Results**:
- ✅ Loading indicator appears
- ✅ Success message or redirect
- ✅ User is automatically logged in
- ✅ Header shows user menu with name
- ✅ Token is stored in localStorage

#### **Check in Browser DevTools**:
```javascript
// Open Console (F12)
localStorage.getItem('auth_token')  // Should show JWT token
localStorage.getItem('auth_user')   // Should show user data
```

---

### **3. User Login Flow**

#### **Step 1: Logout (if logged in)**
- Click user menu → "Logout"
- Verify you're redirected to home page

#### **Step 2: Click Sign In**
- Click "Sign In" button in header

#### **Step 3: Use Test Credentials**
- **Email**: test@example.com
- **Password**: Test123!

#### **Step 4: Submit Form**
- Click "Sign In" button

#### **Expected Results**:
- ✅ Loading indicator appears
- ✅ Successful login
- ✅ Redirect to dashboard/home
- ✅ Header shows user menu
- ✅ Token stored in localStorage

---

### **4. Protected Route Access**

#### **Test Authenticated State**
- While logged in, navigate to protected routes
- Check that user data is displayed
- Verify API calls include Authorization header

#### **Check Network Tab** (F12 → Network):
- Look for requests to `/api/auth/me`
- Check Request Headers:
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

---

### **5. Logout Flow**

#### **Step 1: Click User Menu**
- Click on user name/avatar in header

#### **Step 2: Click Logout**
- Select "Logout" option

#### **Expected Results**:
- ✅ API call to `/api/auth/logout`
- ✅ Token cleared from localStorage
- ✅ User data cleared
- ✅ Redirect to home page
- ✅ Header shows "Sign In" / "Sign Up" buttons again

---

### **6. Error Handling Tests**

#### **Test Invalid Login**
- Try logging in with wrong password
- **Email**: test@example.com
- **Password**: WrongPassword123!

**Expected**: Error message "Invalid email or password"

#### **Test Duplicate Registration**
- Try registering with existing email
- **Email**: test@example.com

**Expected**: Error message "User with this email already exists"

#### **Test Form Validation**
- Try submitting empty forms
- Try invalid email format
- Try short password

**Expected**: Validation error messages

---

### **7. Token Expiration Test**

#### **Simulate Expired Token**
```javascript
// In Browser Console
localStorage.setItem('auth_token', 'invalid-token')
```

#### **Try Accessing Protected Route**
- Navigate to a protected page
- Or refresh the page

**Expected**: 
- ✅ 401 Unauthorized error
- ✅ Redirect to login page
- ✅ Token cleared

---

## 🔍 **API Endpoint Tests**

### **Test with cURL or Postman**

#### **1. Register User**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test User",
    "email": "apitest@example.com",
    "password": "ApiTest123!"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": "uuid",
    "name": "API Test User",
    "email": "apitest@example.com",
    "role": "USER",
    ...
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### **2. Login User**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "ApiTest123!"
  }'
```

#### **3. Get Current User**
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### **4. Logout**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### **5. Forgot Password**
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com"
  }'
```

---

## 🐛 **Common Issues & Solutions**

### **Issue: CORS Error**
**Symptom**: "Access to XMLHttpRequest has been blocked by CORS policy"

**Solution**: 
- Check `server/.env` has `CLIENT_URL=http://localhost:3002`
- Restart server after changing .env

### **Issue: 401 Unauthorized**
**Symptom**: All API calls return 401

**Solution**:
- Check token is being sent in Authorization header
- Verify token is valid (not expired)
- Check JWT_SECRET matches between sign and verify

### **Issue: Connection Refused**
**Symptom**: "ERR_CONNECTION_REFUSED"

**Solution**:
- Verify server is running on port 5000
- Check firewall settings
- Verify DATABASE_URL in server/.env

### **Issue: Database Error**
**Symptom**: "Can't reach database server"

**Solution**:
- Verify MySQL is running on port 3307
- Check DATABASE_URL in server/.env
- Run `npx prisma db push` to sync schema

---

## ✅ **Success Criteria**

The integration is working correctly if:

- ✅ User can register new account
- ✅ User can login with credentials
- ✅ Token is stored and sent with requests
- ✅ Protected routes are accessible when authenticated
- ✅ User can logout successfully
- ✅ Error messages display properly
- ✅ No CORS errors in console
- ✅ No 401 errors for authenticated requests
- ✅ Database operations complete successfully

---

## 📊 **Integration Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Port 3002)                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │  React Components                                   │ │
│  │  ├── Header (Sign In/Sign Up buttons)              │ │
│  │  ├── Auth Forms (Login/Register)                   │ │
│  │  └── Protected Routes                              │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Services & API Layer                              │ │
│  │  ├── authService.ts (login, register, logout)     │ │
│  │  ├── axios.config.ts (interceptors)               │ │
│  │  └── storage.ts (token management)                │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTP Requests
                          │ Authorization: Bearer <token>
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVER (Port 5000)                    │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Express.js Middleware                             │ │
│  │  ├── CORS (allows port 3002)                       │ │
│  │  ├── Helmet (security)                             │ │
│  │  ├── Rate Limiting                                 │ │
│  │  └── Body Parser                                   │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Auth Routes (/api/auth/*)                         │ │
│  │  ├── POST /register                                │ │
│  │  ├── POST /login                                   │ │
│  │  ├── GET  /me                                      │ │
│  │  ├── POST /logout                                  │ │
│  │  └── POST /forgot-password                         │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Prisma ORM                                        │ │
│  │  ├── User Model                                    │ │
│  │  └── RefreshToken Model                           │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ SQL Queries
                          ▼
┌─────────────────────────────────────────────────────────┐
│              MySQL Database (Port 3307)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Tables                                            │ │
│  │  ├── users                                         │ │
│  │  └── refresh_tokens                               │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

**Status**: ✅ **READY FOR TESTING**
**Last Updated**: January 14, 2026
**Servers**: Both running and configured correctly
