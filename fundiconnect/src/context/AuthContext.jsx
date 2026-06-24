import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);
const ADMIN_EMAIL = 'thogorikiburu24@gmail.com';

function withAdminRole(profile, authUser) {
  const email = authUser?.email || profile?.email || '';
  if (email.toLowerCase() !== ADMIN_EMAIL) return { ...profile, email };
  return {
    id: authUser?.id || profile?.id || ADMIN_EMAIL,
    name: profile?.name || 'Admin',
    ...profile,
    email,
    role: 'admin',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // combined auth + profile data
  const [loading, setLoading] = useState(true);

  // Load the profile row for a given auth user id
  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) { setUser(null); return; }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading profile:', error.message);
      setUser(null);
      return;
    }
    if (!data) {
      // Auth account exists but profile row hasn't been created yet.
      setUser(withAdminRole({ id: authUser.id, _noProfile: true }, authUser));
      return;
    }
    setUser(withAdminRole(data, authUser));
  }, []);

  useEffect(() => {
    // initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      loadProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    // listen for login/logout/token refresh/password recovery
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user ?? null).finally(() => setLoading(false));
    });

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  /**
   * Register a new user with Supabase Auth, then create their profile row.
   * profileData: { name, email, phone, password, role, trade, location, rate, bio }
   */
  const register = useCallback(async ({ email, password, ...profileData }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (!data.user) return { error: 'Sign up succeeded but no user was returned. Check your email confirmation settings.' };

    const profileRow = {
      id: data.user.id,
      name: profileData.name,
      email,
      phone: profileData.phone,
      role: profileData.role,
      ...(profileData.role === 'fundi' ? {
        trade: profileData.trade,
        location: profileData.location,
        rate: Number(profileData.rate),
        bio: profileData.bio,
        available: true,
        jobs_done: 0,
      } : {}),
    };

    const { error: profileError } = await supabase.from('profiles').insert(profileRow);
    if (profileError) return { error: profileError.message };

    const newUser = withAdminRole(profileRow, data.user);
    setUser(newUser);
    return { user: newUser };
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    await loadProfile(data.user);

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
    return { user: withAdminRole(profile || { id: data.user.id, _noProfile: true }, data.user) };
  }, [loadProfile]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  /** Update fields on the current user's profile row */
  const updateUser = useCallback(async (updates) => {
    if (!user) return { error: 'Not logged in' };
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) return { error: error.message };
    setUser(u => ({ ...u, ...updates }));
    return { success: true };
  }, [user]);

  /**
   * Send a password reset email. Supabase emails the user a link that
   * redirects to /reset-password on this site with a recovery token in the URL.
   */
  const resetPassword = useCallback(async (email) => {
    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { error: error.message };
    return { success: true };
  }, []);

  /**
   * Set a new password. Must be called while the user has an active
   * "recovery" session after clicking the link from resetPassword().
   */
  const updatePassword = useCallback(async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { error: error.message };
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateUser, resetPassword, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
