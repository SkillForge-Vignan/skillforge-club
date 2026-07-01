// ╔══════════════════════════════════════════════════════════════╗
// ║              SkillForge — keys.config.js                    ║
// ║  ⚠️  DO NOT MODIFY — Backend-connected routes & endpoints   ║
// ║  Frontend team: import from this file only. Never hardcode  ║
// ║  URLs, paths, or API endpoints anywhere in your components. ║
// ║  Only the backend team should update this file.             ║
// ╚══════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────
//  BASE URL
//  Change this one place when deploying to prod
// ─────────────────────────────────────────────
export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";


// ─────────────────────────────────────────────
//  FRONTEND PAGE ROUTES
//  Use with <Link to={ROUTES.LOGIN} /> or navigate(ROUTES.LOGIN)
// ─────────────────────────────────────────────
export const ROUTES = {
  // Public pages
  HOME:             "/",
  ABOUT:            "/about",
  DOMAINS:          "/domains",
  PROJECTS:         "/projects",
  EVENTS:           "/events",
  TEAM:             "/team",
  CONTACT:          "/contact",
  FEEDBACK:         "/feedback",
  LOGIN:            "/login",
  ONBOARDING:       "/onboarding",

  // Student Portal
  STUDENT_PORTAL:           "/student-portal",
  STUDENT_DOMAINS:          "/student-portal/domains",
  STUDENT_PROJECTS:         "/student-portal/projects",
  STUDENT_ASSIGNMENTS:      "/student-portal/assignments",
  STUDENT_PROGRESS:         "/student-portal/progress",
  STUDENT_MENTOR:           "/student-portal/mentor",
  STUDENT_PROFILE:          "/student-portal/profile",

  // Mentor Portal
  MENTOR_PORTAL:            "/mentor-portal",
  MENTOR_STUDENTS:          "/mentor-portal/students",
  MENTOR_ASSIGN:            "/mentor-portal/assign",
  MENTOR_PROGRESS:          "/mentor-portal/progress",
  MENTOR_MESSAGES:          "/mentor-portal/messages",
  MENTOR_PROFILE:           "/mentor-portal/profile",

  // Admin Portal
  ADMIN_PORTAL:             "/admin-portal",
  ADMIN_STUDENTS:           "/admin-portal/students",
  ADMIN_TEAM:               "/admin-portal/team",
  ADMIN_PROJECTS:           "/admin-portal/projects",
  ADMIN_EVENTS:             "/admin-portal/events",
  ADMIN_MESSAGES:           "/admin-portal/messages",
  ADMIN_SETTINGS:           "/admin-portal/settings",
};


// ─────────────────────────────────────────────
//  API ENDPOINTS
//  Use these in fetch() / axios calls only
// ─────────────────────────────────────────────
export const API = {

  // ── Auth (/api/auth) ─────────────────────
  AUTH: {
    SEND_OTP:       `${API_BASE}/auth/send-otp`,        // POST
    VERIFY_OTP:     `${API_BASE}/auth/verify-otp`,      // POST
    REGISTER:       `${API_BASE}/auth/register`,         // POST
    LOGIN:          `${API_BASE}/auth/login`,             // POST
    GET_ME:         `${API_BASE}/auth/me`,               // GET  (🔒 auth required)
    UPDATE_ME:      `${API_BASE}/auth/me`,               // PUT  (🔒 auth required)
    ONBOARDING:     `${API_BASE}/auth/onboarding`,       // POST (🔒 auth required)
    GET_ALL_USERS:  `${API_BASE}/auth/users`,            // GET  (🔒 admin only)
  },

  // ── Events (/api/events) ─────────────────
  EVENTS: {
    GET_ALL:        `${API_BASE}/events`,                // GET
    GET_CATEGORIES: `${API_BASE}/events/categories`,     // GET
    GET_ONE:        (id) => `${API_BASE}/events/${id}`,  // GET
    CREATE:         `${API_BASE}/events`,                // POST
    UPDATE:         (id) => `${API_BASE}/events/${id}`,  // PUT
    DELETE:         (id) => `${API_BASE}/events/${id}`,  // DELETE
  },

  // ── Projects (/api/projects) ─────────────
  PROJECTS: {
    GET_ALL:        `${API_BASE}/projects`,              // GET
    GET_ONE:        (id) => `${API_BASE}/projects/${id}`,// GET
    CREATE:         `${API_BASE}/projects`,              // POST
    UPDATE:         (id) => `${API_BASE}/projects/${id}`,// PUT
    DELETE:         (id) => `${API_BASE}/projects/${id}`,// DELETE
  },

  // ── Team (/api/team) ─────────────────────
  TEAM: {
    GET_ALL:        `${API_BASE}/team`,                  // GET
    GET_ONE:        (id) => `${API_BASE}/team/${id}`,    // GET
    CREATE:         `${API_BASE}/team`,                  // POST (🔒 admin, multipart/form-data avatar)
    UPDATE:         (id) => `${API_BASE}/team/${id}`,    // PUT  (🔒 admin, multipart/form-data avatar)
    DELETE:         (id) => `${API_BASE}/team/${id}`,    // DELETE (🔒 admin)
  },

  // ── Announcements (/api/announcements) ───
  ANNOUNCEMENTS: {
    GET_ALL:        `${API_BASE}/announcements`,                 // GET
    GET_ONE:        (id) => `${API_BASE}/announcements/${id}`,   // GET
    CREATE:         `${API_BASE}/announcements`,                 // POST (🔒 admin)
    UPDATE:         (id) => `${API_BASE}/announcements/${id}`,   // PUT  (🔒 admin)
    DELETE:         (id) => `${API_BASE}/announcements/${id}`,   // DELETE (🔒 admin)
  },

  // ── Members (/api/members) ───────────────
  MEMBERS: {
    GET_ALL:        `${API_BASE}/members`,               // GET  (🔒 admin)
    GET_STATS:      `${API_BASE}/members/stats`,         // GET  (🔒 admin)
    GET_ONE:        (id) => `${API_BASE}/members/${id}`, // GET  (🔒 admin)
    DELETE:         (id) => `${API_BASE}/members/${id}`, // DELETE (🔒 admin)
  },

  // ── Registrations (/api/registrations) ───
  REGISTRATIONS: {
    REGISTER:       `${API_BASE}/registrations`,         // POST
    MY_REGISTRATIONS: `${API_BASE}/registrations/my`,   // GET  (🔒 auth)
    GET_STATS:      `${API_BASE}/registrations/stats`,   // GET  (🔒 admin)
    GET_ALL:        `${API_BASE}/registrations`,         // GET  (🔒 admin)
    CANCEL:         (id) => `${API_BASE}/registrations/${id}`, // DELETE (🔒 admin)
  },

  // ── Assignments (/api/assignments) ───────
  ASSIGNMENTS: {
    GET_ALL:        `${API_BASE}/assignments`,            // GET  (🔒 admin)
    ASSIGN:         `${API_BASE}/assignments`,            // POST (🔒 admin)
    REMOVE:         (id) => `${API_BASE}/assignments/${id}`, // DELETE (🔒 admin)
    GET_MENTORS:    `${API_BASE}/assignments/mentors`,    // GET  (🔒 admin)
    MY_MENTOR:      `${API_BASE}/assignments/my-mentor`,  // GET  (🔒 student)
  },

  // ── Student Portal (/api/student) ────────
  STUDENT: {
    OVERVIEW:       `${API_BASE}/student/overview`,      // GET  (🔒 auth)
    ASSIGNMENTS:    `${API_BASE}/student/assignments`,   // GET  (🔒 auth)
    COMPLETE_TASK:  (id) => `${API_BASE}/student/assignments/${id}`, // PATCH (🔒 auth)
    PROGRESS:       `${API_BASE}/student/progress`,      // GET  (🔒 auth)
    PROFILE:        `${API_BASE}/student/profile`,       // GET  (🔒 auth)
  },

  // ── Mentor Portal (/api/mentor) ──────────
  MENTOR: {
    OVERVIEW:       `${API_BASE}/mentor/overview`,       // GET  (🔒 auth)
    STUDENTS:       `${API_BASE}/mentor/students`,       // GET  (🔒 auth)
    TASKS:          `${API_BASE}/mentor/tasks`,          // GET  (🔒 auth)
    CREATE_TASK:    `${API_BASE}/mentor/tasks`,          // POST (🔒 auth)
    DELETE_TASK:    (id) => `${API_BASE}/mentor/tasks/${id}`, // DELETE (🔒 auth)
    PROFILE:        `${API_BASE}/mentor/profile`,        // GET  (🔒 auth)
  },

  // ── Contact (/api/contact) ───────────────
  CONTACT: {
    SUBMIT:         `${API_BASE}/contact`,               // POST
    GET_MESSAGES:   `${API_BASE}/contact`,               // GET  (🔒 admin)
    MARK_READ:      (id) => `${API_BASE}/contact/${id}/read`, // PATCH (🔒 admin)
    DELETE:         (id) => `${API_BASE}/contact/${id}`, // DELETE (🔒 admin)
  },

  // ── Status (/api/status) ─────────────────
  STATUS:           `${API_BASE}/status`,                // GET
};


// ─────────────────────────────────────────────
//  BUTTON / ACTION LABELS
//  Use these for all button text in the UI
// ─────────────────────────────────────────────
export const LABELS = {
  // Auth
  LOGIN:            "Login",
  LOGOUT:           "Logout",
  REGISTER:         "Register",
  SEND_OTP:         "Send OTP",
  VERIFY_OTP:       "Verify OTP",
  COMPLETE_PROFILE: "Complete Profile",

  // Navigation
  GO_HOME:          "Home",
  GO_ABOUT:         "About",
  GO_EVENTS:        "Events",
  GO_PROJECTS:      "Projects",
  GO_TEAM:          "Team",
  GO_CONTACT:       "Contact Us",
  GO_DOMAINS:       "Domains",

  // Student Portal
  VIEW_ASSIGNMENTS: "My Assignments",
  VIEW_PROGRESS:    "My Progress",
  VIEW_MENTOR:      "My Mentor",
  COMPLETE_TASK:    "Mark Complete",

  // Mentor Portal
  VIEW_STUDENTS:    "My Students",
  ASSIGN_TASK:      "Assign Task",
  DELETE_TASK:      "Delete Task",

  // Admin
  MANAGE_STUDENTS:  "Manage Students",
  MANAGE_TEAM:      "Team Members",
  MANAGE_EVENTS:    "Events",
  MANAGE_PROJECTS:  "Projects",
  VIEW_MESSAGES:    "Messages",

  // General
  SUBMIT:           "Submit",
  SAVE:             "Save Changes",
  CANCEL:           "Cancel",
  DELETE:           "Delete",
  EDIT:             "Edit",
  VIEW_ALL:         "View All",
  REGISTER_EVENT:   "Register for Event",
  CANCEL_REG:       "Cancel Registration",
  SEND_MESSAGE:     "Send Message",
};
