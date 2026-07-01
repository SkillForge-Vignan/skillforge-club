# SkillForge Backend — Frontend Integration Guide

**Read this before touching anything.** This backend is done and tested. You are building a NEW frontend that talks to an EXISTING API. Do not edit anything inside the `backend/` folder. If a screen needs data the API doesn't provide, ask the backend dev to add an endpoint — don't change the backend yourself to "make it easier."

---

## 1. The one rule

> **The backend folder is read-only for you.**
> Your job is to call these URLs and render what they return. If something doesn't fit, that's a conversation, not a unilateral edit.

---

## 2. Base setup

- Base URL: `http://localhost:5000/api` (or whatever `PORT` is set to in `.env`)
- All requests/responses are JSON.
- Auth: send `Authorization: Bearer <token>` on every protected route. Token comes back from `/auth/login` or `/auth/register`.
- Full live docs with request/response schemas: **`http://localhost:5000/api-docs`** (Swagger). When in doubt, check there first — it's auto-generated from the actual code, so it can't drift out of date.

---

## 3. Every endpoint, grouped by who can call it

### Public — no token needed

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/send-otp` | Send a 6-digit OTP to an email before signup |
| POST | `/auth/verify-otp` | Verify that OTP |
| POST | `/auth/register` | Create a student account → returns `token` + `user` |
| POST | `/auth/login` | Login (any role) → returns `token` + `user` |
| GET | `/events` | List events |
| GET | `/events/categories` | List event categories |
| GET | `/events/:id` | One event |
| GET | `/projects` | List projects |
| GET | `/projects/:id` | One project |
| GET | `/team` | List team members |
| GET | `/team/:id` | One team member |
| GET | `/announcements` | List announcements |
| GET | `/announcements/:id` | One announcement |
| POST | `/contact` | Submit contact form |
| POST | `/registrations` | Register for an event |

### Logged-in user (any role) — needs `Authorization: Bearer <token>`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/auth/me` | Get current user's profile |
| PUT | `/auth/me` | Update name / password |
| GET | `/registrations/my` | My event registrations |
| GET | `/assignments/my-mentor` | My assigned mentor (students) |

### Student only

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/onboarding` | Complete onboarding form (year, branch, domain, etc.) |
| GET | `/student/overview` | Dashboard overview: stats, assignments, progress |
| GET | `/student/assignments` | My assigned tasks |
| PATCH | `/student/assignments/:id` | Mark a task complete |
| GET | `/student/progress` | Skill/domain progress breakdown |
| GET | `/student/profile` | My student profile |
| GET | `/messages/student/:mentorId` | My chat with a mentor |
| POST | `/messages/student/:mentorId` | Send message to mentor |

### Mentor only (admin can also use these)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/mentor/overview` | Dashboard overview |
| GET | `/mentor/students` | My assigned students (supports `?page=&limit=`) |
| GET | `/mentor/tasks` | Tasks I've created |
| POST | `/mentor/tasks` | Create a task |
| DELETE | `/mentor/tasks/:id` | Delete a task |
| GET | `/mentor/profile` | My mentor profile |
| GET | `/messages/unread-counts` | Unread message counts per student |
| GET | `/messages/:studentId` | Chat with a specific student |
| POST | `/messages/:studentId` | Send message to a student |

### Admin only

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/auth/users` | All users across roles |
| POST | `/events`, `PUT /events/:id`, `DELETE /events/:id` | Manage events |
| POST | `/projects`, `PUT /projects/:id`, `DELETE /projects/:id` | Manage projects |
| POST | `/team`, `PUT /team/:id`, `DELETE /team/:id` | Manage team members (multipart, field name `avatar`) |
| POST | `/announcements`, `PUT /announcements/:id`, `DELETE /announcements/:id` | Manage announcements |
| GET | `/contact`, `PATCH /contact/:id/read`, `DELETE /contact/:id` | Manage contact messages |
| GET | `/registrations`, `GET /registrations/stats`, `DELETE /registrations/:id` | Manage registrations |
| GET | `/members`, `GET /members/stats`, `GET /members/:id`, `DELETE /members/:id` | Manage members |
| GET | `/assignments`, `POST /assignments`, `DELETE /assignments/:id`, `GET /assignments/mentors` | Manage mentor↔student assignments |

---

## 4. Things that will break if you "fix" them on your own

**Don't rename fields in requests.** The backend expects exact field names like `assignedTo`, `domainInterest`, `rollNumber`, `isPinned`, `githubUrl`/`github_url` (both accepted), etc. If a field is camelCase in one place and snake_case in another, that's intentional — match what's documented in Swagger for that specific endpoint, don't standardize it yourself.

**Don't assume every list endpoint returns everything.** `/mentor/students` accepts `?page=` and `?limit=` — if your new frontend pulls big lists, use pagination instead of expecting one giant array forever.

**Don't change the auth header format.** It must be exactly `Authorization: Bearer <token>`, not `Token <token>` or a cookie — the backend's `protect` middleware only parses the `Bearer` scheme.

**Don't expect instant consistency right after registration.** A new student is written to both a `students` table and a `users` table for internal reasons. This is backend plumbing — don't build frontend logic that pokes at the `users` table or tries to "fix" the duplication.

**File uploads use `multipart/form-data` with field name `avatar`**, not JSON with a base64 string. Only `/team` (POST/PUT) accepts file uploads currently.

**Error responses have a consistent shape:**
```json
{ "error": "Human readable message", "status": "fail", "statusCode": 400 }
```
Always render `error`, and use `statusCode` for any conditional logic (e.g. redirect to login on 401). Don't write code that guesses error shape per-endpoint.

---

## 5. If the new frontend needs something the API doesn't provide

Don't add a new Supabase query, don't add a new route file, don't touch `controllers/`. Instead:

1. Write down exactly what data/shape you need and which screen needs it.
2. Send it to the backend dev.
3. They add or modify an endpoint and update Swagger.
4. You consume the new endpoint.

This keeps the backend as a single source of truth instead of two people editing the same logic from different directions.

---

## 6. Quick sanity checklist before you ship the new frontend

- [ ] Login/register still returns `{ token, user }` and you're storing the token correctly
- [ ] Every protected fetch includes `Authorization: Bearer <token>`
- [ ] 401 responses redirect to login (token expired or missing)
- [ ] 403 responses show a "not allowed" state, not a generic error page
- [ ] File upload to `/team` uses `FormData`, not JSON
- [ ] You've checked `/api-docs` for the exact shape of any endpoint you're unsure about
