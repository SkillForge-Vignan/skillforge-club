const API = "http://localhost:5000/api";

const request = async (path, opts = {}) => {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
};

export const api = {
  getEvents:     () => request('/events'),
  getTeam:       () => request('/team'),

  // Contact
  submitContact: (body) => request('/contact', { method: 'POST', body: JSON.stringify(body) }),

  // Registrations
  registerForEvent: (body) => request('/registrations', { method: 'POST', body: JSON.stringify(body) }),

  // Projects CRUD
  getProjects:   ()         => request('/projects'),
  getProject:    (id)       => request(`/projects/${id}`),
  createProject: (body)     => request('/projects', { method: 'POST', body: JSON.stringify(body) }),
  updateProject: (id, body) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteProject: (id)       => request(`/projects/${id}`, { method: 'DELETE' }),
};