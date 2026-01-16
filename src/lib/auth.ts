// Simple client-side auth for demonstration
// In a real application, this should validate against a backend API

const AUTH_KEY = 'topone_auth_token';

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(AUTH_KEY) === 'true';
};

export const login = (password: string): boolean => {
  // Hardcoded password for now - in production this should be an environment variable or backend check
  // Default password: "admin"
  if (password === 'admin') {
    localStorage.setItem(AUTH_KEY, 'true');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = '/login';
};
