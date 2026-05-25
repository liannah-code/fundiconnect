import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Btn, Input, Spinner, toast } from '../components/UI';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(form);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    toast(`Welcome back, ${result.user.name.split(' ')[0]}!`);
    navigate(result.user.role === 'fundi' ? '/dashboard' : '/browse');
  };

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #fff8f3 0%, #edfaf3 100%)' }}>
      <div className="animate-fadeUp" style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', padding: '36px 32px', boxShadow: 'var(--shadow-lg)' }}>
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
            <span style={{ fontSize: 13, color: 'var(--orange)', cursor: 'pointer', fontWeight: 500 }}>Forgot password?</span>
          </div>
          <Btn type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? <Spinner /> : 'Log in'}
          </Btn>
        </form>

        <div style={{ marginTop: 24, padding: 16, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-400)', marginBottom: 8 }}>DEMO ACCOUNTS</p>
          <DemoBtn email="james@demo.com" label="James (Electrician)" onLogin={(e,p) => { setForm({ email: e, password: p }); }} />
          <DemoBtn email="fatuma@demo.com" label="Fatuma (Plumber)" onLogin={(e,p) => { setForm({ email: e, password: p }); }} />
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--gray-400)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--orange)', fontWeight: 600 }}>Sign up free</Link>
        </p>
      </div>
    </div>
  );
}

function DemoBtn({ email, label, onLogin }) {
  return (
    <button onClick={() => onLogin(email, 'demo')}
      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 8px', borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--orange)', fontWeight: 500 }}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--orange-light)'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
      → {label}
    </button>
  );
}
