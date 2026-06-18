import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Btn, Input, Spinner, toast } from '../components/UI';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReset, setShowReset] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(form);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    toast(`Welcome back, ${(result.user.name || result.user.email).split(' ')[0]}!`);
    navigate(result.user.role === 'fundi' ? '/dashboard' : '/browse');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #fff8f3 0%, #edfaf3 100%)' }}>
      <div className="animate-fadeUp" style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', padding: '36px 32px', boxShadow: 'var(--shadow-lg)' }}>

        {!showReset ? (
          <>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, marginBottom: 6 }}>Welcome back</h1>
            <p style={{ color: 'var(--gray-400)', fontSize: 14, marginBottom: 28 }}>Log in to your FundiConnect account</p>

            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#b91c1c', marginBottom: 20 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input label="Email address" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required />
              <Input label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Your password" required />
              <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'flex-end' }}>
                <span onClick={() => setShowReset(true)} style={{ fontSize: 13, color: 'var(--orange)', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</span>
              </div>
              <Btn type="submit" fullWidth size="lg" disabled={loading}>
                {loading ? <Spinner /> : 'Log in'}
              </Btn>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--gray-400)' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--orange)', fontWeight: 600 }}>Sign up free</Link>
            </p>
          </>
        ) : (
          <ForgotPasswordForm onBack={() => setShowReset(false)} />
        )}
      </div>
    </div>
  );
}

function ForgotPasswordForm({ onBack }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setSent(true);
  };

  if (sent) {
    return (
      <div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, marginBottom: 10 }}>Check your email</h2>
        <p style={{ fontSize: 14, color: 'var(--gray-600)', marginBottom: 24, lineHeight: 1.6 }}>
          We sent a password reset link to <strong>{email}</strong>. Click the link in that email to set a new password.
        </p>
        <Btn fullWidth variant="secondary" onClick={onBack}>Back to login</Btn>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', fontSize: 20, lineHeight: 1 }}>←</button>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24 }}>Reset your password</h2>
      </div>
      <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 24, paddingLeft: 32 }}>
        Enter your email and we'll send you a reset link.
      </p>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 13, color: '#b91c1c', marginBottom: 20 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
        <Btn type="submit" fullWidth size="lg" disabled={loading}>
          {loading ? <Spinner /> : 'Send reset link'}
        </Btn>
      </form>
    </div>
  );
}