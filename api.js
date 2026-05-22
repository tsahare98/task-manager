const API_BASE = '/api';
// Helper to make fetch calls with auth token attached
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
}
export const api = {
  auth: {
    register: (name, email, password) => 
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      }),
      
    login: (email, password) => 
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),
      
    me: () => request('/auth/me')
  },
  
  tasks: {
    getAll: () => request('/tasks'),
    
    create: (taskData) => 
      request('/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
      }),
      
    update: (id, taskData) => 
      request(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData)
      }),
      
    delete: (id) => 
      request(`/tasks/${id}`, {
        method: 'DELETE'
      })
  }
};
export default api;
