# SkillForge — Backend API

> Express.js REST API for the SkillForge Club website.

---

## 🚀 Quick Start

```bash
cd backend
npm install
cp .env.example .env     # fill in your values
npm run dev              # starts on http://localhost:5000
```

---

## 📁 Folder Structure

```
backend/
├── server.js               # Entry point
├── config/
│   └── db.js               # In-memory data store (swap for real DB later)
├── controllers/
│   ├── authController.js
│   ├── eventsController.js
│   ├── projectsController.js
│   ├── teamController.js
│   ├── registrationsController.js
│   ├── announcementsController.js
│   ├── contactController.js
│   └── membersController.js
├── routes/
│   ├── auth.js
│   ├── events.js
│   ├── projects.js
│   ├── team.js
│   ├── registrations.js
│   ├── announcements.js
│   ├── contact.js
│   └── members.js
├── middleware/
│   ├── auth.js             # JWT protect + adminOnly guards
│   ├── upload.js           # Multer image uploads
│   └── validate.js         # express-validator helper
├── utils/
│   └── mailer.js           # Nodemailer (contact + registration emails)
├── uploads/                # Static image files (auto-created)
├── .env.example
└── package.json
```

---

## 🔐 Authentication

All protected routes require:
```
Authorization: Bearer <token>
```

Default admin credentials (seeded):
- **Email:** `admin@skillforge.club`
- **Password:** `Admin@1234`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | 🔒 User | Get own profile |
| PUT | `/api/auth/me` | 🔒 User | Update name/password |
| GET | `/api/auth/users` | 🔒 Admin | List all users |

### Events
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/events` | Public | List all events (`?category=&active=`) |
| GET | `/api/events/categories` | Public | Get unique categories |
| GET | `/api/events/:id` | Public | Get single event |
| POST | `/api/events` | 🔒 Admin | Create event (multipart/form-data) |
| PUT | `/api/events/:id` | 🔒 Admin | Update event |
| DELETE | `/api/events/:id` | 🔒 Admin | Delete event |

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/projects` | Public | List all projects (`?category=&status=&featured=`) |
| GET | `/api/projects/:id` | Public | Get single project |
| POST | `/api/projects` | 🔒 Admin | Create project |
| PUT | `/api/projects/:id` | 🔒 Admin | Update project |
| DELETE | `/api/projects/:id` | 🔒 Admin | Delete project |

### Team
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/team` | Public | List team members (sorted by order) |
| GET | `/api/team/:id` | Public | Get single member |
| POST | `/api/team` | 🔒 Admin | Add team member |
| PUT | `/api/team/:id` | 🔒 Admin | Update member |
| DELETE | `/api/team/:id` | 🔒 Admin | Remove member |

### Registrations
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/registrations` | Public | Register for an event |
| GET | `/api/registrations/my` | 🔒 User | Get own registrations |
| GET | `/api/registrations` | 🔒 Admin | All registrations (`?eventId=`) |
| GET | `/api/registrations/stats` | 🔒 Admin | Registration stats per event |
| DELETE | `/api/registrations/:id` | 🔒 Admin | Cancel a registration |

### Announcements
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/announcements` | Public | List announcements (`?type=`) |
| GET | `/api/announcements/:id` | Public | Get single announcement |
| POST | `/api/announcements` | 🔒 Admin | Create announcement |
| PUT | `/api/announcements/:id` | 🔒 Admin | Update announcement |
| DELETE | `/api/announcements/:id` | 🔒 Admin | Delete announcement |

### Contact
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/contact` | Public | Submit contact form |
| GET | `/api/contact` | 🔒 Admin | List messages (`?unread=true`) |
| PATCH | `/api/contact/:id/read` | 🔒 Admin | Mark message as read |
| DELETE | `/api/contact/:id` | 🔒 Admin | Delete message |

### Members
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/members` | 🔒 Admin | List all members |
| GET | `/api/members/stats` | 🔒 Admin | Member count stats |
| GET | `/api/members/:id` | 🔒 Admin | Get member by ID |
| PATCH | `/api/members/:id/role` | 🔒 Admin | Change user role |
| DELETE | `/api/members/:id` | 🔒 Admin | Remove member |

### Health
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | Public | API status check |

---

## 🔄 Connecting the Frontend

In your React app, use this base URL:
```js
// src/api/client.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
```

Set in your frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🗃️ Upgrading to a Real Database

The in-memory store (`config/db.js`) is intentionally simple — just arrays.
To upgrade, replace the array operations in each controller with:
- **MongoDB**: `mongoose` models + `.find()`, `.save()`, `.deleteOne()`
- **PostgreSQL**: `pg` or `prisma` queries
- **Supabase**: `@supabase/supabase-js` client calls

The controller/route structure stays identical — only the data layer changes.
