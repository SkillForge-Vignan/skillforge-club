# SkillForge Backend API Guide

## 📖 Overview

The SkillForge Backend is a complete REST API built with Express.js and Supabase, featuring comprehensive validation, security, and documentation.

**Base URL:** `http://localhost:5000/api`
**Docs:** `http://localhost:5000/api-docs`

---

## 🔐 Authentication

All protected endpoints require JWT Bearer token in Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Expiration
- Access Token: 7 days
- Refresh Token: 30 days

---

## 📝 Complete API Reference

### Auth Endpoints

#### 1. Send OTP
```http
POST /auth/send-otp
Content-Type: application/json

{
  "email": "user@example.com"
}

Response: 200 OK
{
  "message": "OTP sent to your email"
}
```

**Validation:**
- `email`: Valid email format (required)

---

#### 2. Verify OTP
```http
POST /auth/verify-otp
Content-Type: application/json

{
  "email": "user@example.com",
  "otp": "123456"
}

Response: 200 OK
{
  "message": "Email verified",
  "verified": true
}
```

**Validation:**
- `email`: Valid email format (required)
- `otp`: Exactly 6 digits (required)

---

#### 3. Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 201 Created
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "token": "eyJhbGc..."
}
```

**Validation:**
- `name`: 2-100 characters (required)
- `email`: Valid email format (required)
- `password`: Min 8 chars, uppercase, lowercase, number (required)

---

#### 4. Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response: 200 OK
{
  "user": { id, name, email, role },
  "token": "eyJhbGc..."
}
```

**Validation:**
- `email`: Valid email format (required)
- `password`: Required (min 8 chars with uppercase, lowercase, number)

---

#### 5. Get My Profile
```http
GET /auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Authorization:** Required (any authenticated user)

---

#### 6. Update Profile
```http
PUT /auth/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "bio": "Full-stack developer",
  "avatar": "https://example.com/avatar.jpg"
}

Response: 200 OK
{
  "id": "uuid",
  "name": "John Smith",
  "bio": "Full-stack developer",
  ...
}
```

**Validation:**
- `name`: 2-100 characters (optional)
- `bio`: Max 500 characters (optional)
- `avatar`: Valid URL (optional)

---

#### 7. Complete Onboarding
```http
POST /auth/onboarding
Authorization: Bearer <token>
Content-Type: application/json

{
  "skills": ["JavaScript", "React"],
  "interests": ["Web Development", "AI"]
}

Response: 200 OK
{ "message": "Onboarding completed" }
```

---

#### 8. Get All Users (Admin Only)
```http
GET /auth/users
Authorization: Bearer <admin-token>

Response: 200 OK
[
  { id, name, email, role, created_at },
  ...
]
```

**Authorization:** Admin only

---

### Events Endpoints

#### 1. Get All Events
```http
GET /events?category=Workshop&active=true

Query Parameters:
- category: Filter by category (optional)
- active: Filter by active status true/false (optional)

Response: 200 OK
[
  {
    "id": "uuid",
    "title": "Web Development Workshop",
    "description": "Learn modern web dev",
    "date": "2024-06-15",
    "time": "10:00",
    "venue": "Lab 101",
    "category": "Workshop",
    "capacity": 50,
    "registered": 30,
    "is_active": true,
    "created_at": "2024-01-10T10:00:00Z"
  }
]
```

---

#### 2. Get Event by ID
```http
GET /events/{id}

Response: 200 OK
{
  "id": "uuid",
  "title": "Web Development Workshop",
  "description": "Learn modern web dev",
  "date": "2024-06-15",
  "time": "10:00",
  "venue": "Lab 101",
  "category": "Workshop",
  "capacity": 50,
  "registered": 30,
  "is_active": true,
  "created_at": "2024-01-10T10:00:00Z"
}
```

**Validation:**
- `id`: Valid UUID (required)

---

#### 3. Create Event (Admin Only)
```http
POST /events
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "AI & Machine Learning Seminar",
  "description": "Deep dive into AI/ML concepts",
  "date": "2024-06-20",
  "time": "14:00",
  "venue": "Auditorium",
  "category": "Seminar",
  "capacity": 100,
  "tags": ["AI", "ML", "Tech"]
}

Response: 201 Created
{
  "id": "uuid",
  "title": "AI & Machine Learning Seminar",
  ...
}
```

**Validation:**
- `title`: Max 200 characters (required)
- `description`: Max 2000 characters (optional)
- `date`: ISO8601 format (required)
- `time`: HH:MM format (optional)
- `venue`: Max 300 characters (required)
- `category`: One of [Workshop, Seminar, Hackathon, Meetup, Competition, Other] (required)
- `capacity`: 1-10000 (optional, default 100)

---

#### 4. Update Event (Admin Only)
```http
PUT /events/{id}
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "capacity": 150
}

Response: 200 OK
{ ...updated event object }
```

---

#### 5. Delete Event (Admin Only)
```http
DELETE /events/{id}
Authorization: Bearer <admin-token>

Response: 200 OK
{ "message": "Event deleted" }
```

---

#### 6. Get Event Categories
```http
GET /events/categories

Response: 200 OK
["Workshop", "Seminar", "Hackathon", "Meetup", "Competition", "Other"]
```

---

### Projects Endpoints

#### 1. Get All Projects
```http
GET /projects

Response: 200 OK
[
  {
    "id": "uuid",
    "title": "E-Commerce Platform",
    "description": "Full-stack e-commerce solution",
    "category": "Web App",
    "tech_stack": ["React", "Node.js", "MongoDB"],
    "github_url": "https://github.com/...",
    "live_url": "https://example.com",
    "status": "In Progress",
    "featured": true,
    "created_at": "2024-01-05T10:00:00Z"
  }
]
```

---

#### 2. Get Project by ID
```http
GET /projects/{id}

Response: 200 OK
{ ...project object }
```

---

#### 3. Create Project
```http
POST /projects
Content-Type: application/json

{
  "title": "AI Chatbot",
  "description": "Intelligent conversational AI",
  "category": "AI/ML",
  "tech_stack": ["Python", "TensorFlow", "Flask"],
  "github_url": "https://github.com/...",
  "live_url": "https://chatbot.example.com",
  "status": "In Progress"
}

Response: 201 Created
{ ...created project object }
```

**Validation:**
- `title`: Max 200 characters (required)
- `description`: Max 2000 characters (required)
- `category`: Required
- `github_url`: Valid URL (optional)
- `live_url`: Valid URL (optional)

---

#### 4. Update Project
```http
PUT /projects/{id}
Content-Type: application/json

{ ...updated fields }

Response: 200 OK
{ ...updated project object }
```

---

#### 5. Delete Project
```http
DELETE /projects/{id}

Response: 200 OK
{ "message": "Project deleted" }
```

---

### Assignments Endpoints

#### 1. Get All Assignments (Admin Only)
```http
GET /assignments
Authorization: Bearer <admin-token>

Response: 200 OK
[
  {
    "id": "uuid",
    "student_id": "uuid",
    "mentor_id": "uuid",
    "created_at": "2024-01-10T10:00:00Z"
  }
]
```

---

#### 2. Create Assignment (Admin Only)
```http
POST /assignments
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "student_id": "uuid",
  "mentor_id": "uuid"
}

Response: 201 Created
{ ...assignment object }
```

---

#### 3. Get My Mentor
```http
GET /assignments/my-mentor
Authorization: Bearer <student-token>

Response: 200 OK
{
  "id": "uuid",
  "name": "Dr. Sarah",
  "email": "sarah@example.com",
  "role": "mentor"
}
```

---

#### 4. Delete Assignment (Admin Only)
```http
DELETE /assignments/{id}
Authorization: Bearer <admin-token>

Response: 200 OK
{ "message": "Assignment deleted" }
```

---

### Contact Endpoints

#### 1. Submit Contact Form
```http
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about membership",
  "message": "I would like to know more about..."
}

Response: 201 Created
{ "message": "Message sent successfully" }
```

**Validation:**
- `name`: Required
- `email`: Valid email (required)
- `subject`: Required
- `message`: Required

---

#### 2. Get All Messages (Admin Only)
```http
GET /contact
Authorization: Bearer <admin-token>

Response: 200 OK
[ ...messages ]
```

---

#### 3. Mark Message as Read (Admin Only)
```http
PATCH /contact/{id}/read
Authorization: Bearer <admin-token>

Response: 200 OK
{ "message": "Marked as read" }
```

---

#### 4. Delete Message (Admin Only)
```http
DELETE /contact/{id}
Authorization: Bearer <admin-token>

Response: 200 OK
{ "message": "Message deleted" }
```

---

## ⚠️ Error Responses

### Validation Error (400)
```json
{
  "error": "Validation failed",
  "status": "fail",
  "statusCode": 400,
  "details": [
    {
      "value": "weak",
      "msg": "Password must be at least 8 characters",
      "param": "password",
      "location": "body"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "error": "Token expired. Please login again.",
  "status": "fail",
  "statusCode": 401
}
```

### Forbidden (403)
```json
{
  "error": "Admin access required",
  "status": "fail",
  "statusCode": 403
}
```

### Not Found (404)
```json
{
  "error": "Resource not found",
  "status": "fail",
  "statusCode": 404
}
```

### Server Error (500)
```json
{
  "error": "Internal Server Error",
  "status": "error",
  "statusCode": 500,
  "stack": "... (development only)"
}
```

---

## 🔄 Common Workflows

### Register and Login
1. POST `/auth/send-otp` with email
2. POST `/auth/verify-otp` with email and OTP
3. POST `/auth/register` with name, email, password
4. Receive JWT token in response

### Create Event
1. Login with admin account
2. POST `/events` with event details
3. Event is created and can be accessed by anyone

### Browse and Register Events
1. GET `/events` to see all events
2. GET `/events/{id}` for event details
3. Register endpoint (if available) to sign up

---

## 📊 Rate Limiting

- **Auth Routes:** 10 requests per 15 minutes
- **All API Routes:** 100 requests per 15 minutes

---

## 🔑 Environment Variables

Create `.env` file in backend directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-key-here
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email
GMAIL_USER=your-email@gmail.com
GMAIL_PASSWORD=your-app-password
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start server
npm start

# Start with auto-reload
npm run dev

# Run tests
npm test
```

---

## 📚 Additional Resources

- **Swagger UI:** http://localhost:5000/api-docs
- **Health Check:** http://localhost:5000/api/health
- **Backend Guide:** See ENHANCEMENTS.md

---

**Last Updated:** 2024-01-15
**API Version:** 1.0.0
