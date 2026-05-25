import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Simulated user store (replace with Supabase / Firebase auth in production)
const USERS_KEY = 'fc_users';
const SESSION_KEY = 'fc_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  });

  const register = useCallback(({ name, email, phone, password, role, trade, location, rate, bio }) => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { error: 'An account with this email already exists.' };
    }
    const newUser = {
      id: Date.now().toString(),
      name, email, phone, password, role,
      ...(role === 'fundi' ? { trade, location, rate: Number(rate), bio, rating: null, reviews: [], jobsDone: 0, available: true } : {}),
      createdAt: new Date().toISOString(),
    };
    saveUsers([...users, newUser]);
    const session = { ...newUser };
    delete session.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { user: session };
  }, []);

  const login = useCallback(({ email, password }) => {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) return { error: 'Invalid email or password.' };
    const session = { ...found };
    delete session.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
    return { user: session };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    const updated = { ...user, ...updates };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    // also update in users store
    const users = getUsers();
    const idx = users.findIndex(u => u.id === updated.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      saveUsers(users);
    }
    setUser(updated);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
