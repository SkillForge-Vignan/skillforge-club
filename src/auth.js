const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const authApi = {
  sendOtp: async (email) => {
    const res = await fetch(`${BASE_URL}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json();
  },
  verifyOtp: async (email, otp) => {
    const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    return res.json();
  },
  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  register: async (name, email, password) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    return res.json();
  },
};

// Role-specific keys: admin → adminToken/adminUser, mentor → mentorToken/mentorUser, student → studentToken/studentUser
const tokenKey = (role) => `${role}Token`;
const userKey  = (role) => `${role}User`;

export const saveToken = (token, user) => {
  const role = user?.role ?? "student";
  localStorage.setItem(tokenKey(role), token);
  localStorage.setItem(userKey(role), JSON.stringify(user));
};

export const getTokenFor  = (role) => localStorage.getItem(tokenKey(role));
export const getUserFor   = (role) => JSON.parse(localStorage.getItem(userKey(role)) || "null");

export const logoutRole = (role) => {
  localStorage.removeItem(tokenKey(role));
  localStorage.removeItem(userKey(role));
};

// Legacy helpers (used by DashboardLayout via role prop)
export const getToken = () =>
  getTokenFor("admin") || getTokenFor("mentor") || getTokenFor("student");

export const getUser = () =>
  getUserFor("admin") || getUserFor("mentor") || getUserFor("student");

export const logout = () => {
  ["admin", "mentor", "student"].forEach(logoutRole);
};

export const isLoggedIn = () => !!getToken();
