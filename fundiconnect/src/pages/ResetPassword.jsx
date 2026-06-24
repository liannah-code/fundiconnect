import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Btn, Input, Spinner, toast } from '../components/UI';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    async function prepareRecoverySession() {
      const query = new URLSearchParams(window.location.search);
      const code = query.get('code');
      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      if (session) setReady(true);
      else setError('This password reset link is invalid or has expired. Please request a new one.');
    }

    prepareRecoverySession();
    return () => { active = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    toast('Password updated! Please log in again.');
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #fff8f3 0%, #edfaf3 100%)' }}>
      <div className="animate-fadeUp" style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', padding: '36px 32px', boxShadow: 'var(--shadow-lg)' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginBottom: 6 }}>Set a new password</h1>
        <p style={{ color: 'var(--gray-400)', fontSize: 14, marginBottom: 28 }}>Choose a new password for your account.</p>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#b91c1c', marginBottom: 20 }}>
            {error}
          </div>
        )}

        {ready && (
          <form onSubmit={handleSubmit}>
            <Input label="New password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
            <Input label="Confirm new password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" required />
            <Btn type="submit" fullWidth size="lg" disabled={loading}>
              {loading ? <Spinner /> : 'Update password'}
            </Btn>
          </form>
        )}
      </div>
    </div>
  );
}
