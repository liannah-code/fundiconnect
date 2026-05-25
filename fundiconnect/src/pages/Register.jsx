import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Btn, Input, Select, Textarea, Divider, Spinner } from '../components/UI';
import { toast } from '../components/UI';
import { Wrench, User } from 'lucide-react';

const TRADES = ['Electrician','Plumber','Painter','Carpenter','Mason','Welder','Cleaner','Tiler','Roofer','Other'];
const LOCATIONS = ['Westlands','Kibera','Kasarani','Langata','Embakasi','Karen','Ruaraka','Dagoretti','Starehe','Makadara','Industrial Area','South B','South C','Hurlingham','Kilimani'];

export default function Register() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(params.get('role') || '');
  const [step, setStep] = useState(1); // 1 = pick role, 2 = fill details
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', trade: 'Electrician', location: 'Westlands', rate: '', bio: '' });
  const { register } = useAuth();
  const navigate = useNavigate();

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.includes('@')) e.email = 'Enter a valid email';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (role === 'fundi') {
      if (!form.rate || isNaN(form.rate)) e.rate = 'Enter your hourly rate';
      if (!form.bio.trim()) e.bio = 'Please describe your services';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = register({ ...form, role });
    setLoading(false);
    if (result.error) { toast(result.error, 'error'); return; }
    toast(`Welcome to FundiConnect, ${form.name.split(' ')[0]}!`);
    navigate(role === 'fundi' ? '/dashboard' : '/browse');
  };

  if (step === 1) {
    return (
      <div style={{ minHeight: 'calc(100vh - var(--nav-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #fff8f3 0%, #edfaf3 100%)' }}>
        <div className="animate-fadeUp" style={{ width: '100%', maxWidth: 480 }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 34, textAlign: 'center', marginBottom: 8 }}>Create your account</h1>
          <p style={{ textAlign: 'center', color: 'var(--gray-600)', marginBottom: 36 }}>Join FundiConnect — what brings you here?</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <RoleCard icon={User} title="I need a fundi" desc="Find and book trusted local tradespeople" selected={role === 'customer'} onClick={() => setRole('customer')} />
            <RoleCard icon={Wrench} title="I am a fundi" desc="List my services and get clients" selected={role === 'fundi'} onClick={() => setRole('fundi')} />
          </div>
          <Btn fullWidth size="lg" disabled={!role} onClick={() => setStep(2)}>Continue</Btn>
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--gray-400)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--orange)', fontWeight: 600 }}>Log in</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - var(--nav-height))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: 'linear-gradient(135deg, #fff8f3 0%, #edfaf3 100%)' }}>
      <div className="animate-fadeUp" style={{ width: '100%', maxWidth: 520, background: '#fff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--gray-200)', padding: '36px 32px', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', fontSize: 20, lineHeight: 1 }}>←</button>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26 }}>
            {role === 'fundi' ? 'Create your fundi profile' : 'Create your account'}
          </h2>
        </div>
        <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 24, paddingLeft: 32 }}>
          Signing up as a <strong style={{ color: 'var(--orange)' }}>{role === 'fundi' ? 'Fundi' : 'Customer'}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <div style={{ gridColumn: '1/-1' }}>
              <Input label="Full name" value={form.name} onChange={set('name')} placeholder="e.g. James Mwangi" required error={errors.name} />
            </div>
            <Input label="Email address" type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required error={errors.email} />
            <Input label="Phone number" type="tel" value={form.phone} onChange={set('phone')} placeholder="0712 345 678" required error={errors.phone} />
            <Input label="Password" type="password" value={form.password} onChange={set('password')} placeholder="Min 6 characters" required error={errors.password} />
            <Input label="Confirm password" type="password" value={form.confirm} onChange={set('confirm')} placeholder="Repeat password" required error={errors.confirm} />
          </div>

          {role === 'fundi' && (
            <>
              <Divider label="Your fundi details" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                <Select label="Trade / skill" value={form.trade} onChange={set('trade')} options={TRADES} required />
                <Select label="Your area" value={form.location} onChange={set('location')} options={LOCATIONS} required />
                <div style={{ gridColumn: '1/-1' }}>
                  <Input label="Hourly rate (KSh)" type="number" value={form.rate} onChange={set('rate')} placeholder="e.g. 600" required error={errors.rate} prefix="KSh" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <Textarea label="About your services" value={form.bio} onChange={set('bio')} placeholder="Describe your experience, specialties, tools you own..." required rows={3} />
                  {errors.bio && <p style={{ fontSize: 12, color: '#dc2626', marginTop: -10, marginBottom: 12 }}>{errors.bio}</p>}
                </div>
              </div>
            </>
          )}

          <Btn type="submit" fullWidth size="lg" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? <Spinner /> : role === 'fundi' ? 'Create fundi profile' : 'Create account'}
          </Btn>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--gray-400)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--orange)', fontWeight: 600 }}>Log in</Link>
        </p>
        <p style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: 'var(--gray-400)', lineHeight: 1.5 }}>
          By continuing you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, desc, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      padding: 20, borderRadius: 'var(--radius-lg)', cursor: 'pointer',
      border: selected ? '2px solid var(--orange)' : '1.5px solid var(--gray-200)',
      background: selected ? 'var(--orange-light)' : '#fff',
      transition: 'all 0.15s', textAlign: 'center',
      boxShadow: selected ? '0 0 0 3px rgba(232,98,26,0.12)' : 'none',
    }}>
      <div style={{ width: 48, height: 48, borderRadius: '50%', background: selected ? 'var(--orange)' : 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
        <Icon size={22} color={selected ? '#fff' : 'var(--gray-600)'} />
      </div>
      <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: selected ? 'var(--orange)' : 'var(--gray-800)' }}>{title}</p>
      <p style={{ fontSize: 12, color: 'var(--gray-400)', lineHeight: 1.5 }}>{desc}</p>
    </div>
  );
}
