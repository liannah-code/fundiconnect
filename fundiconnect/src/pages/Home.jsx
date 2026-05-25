import { useNavigate } from 'react-router-dom';
import { Wrench, Zap, Hammer, Droplets, PaintBucket, BrickWall, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { Btn } from '../components/UI';

const TRADES = [
  { icon: Zap,          label: 'Electrician', color: '#fef9c3', iconColor: '#ca8a04' },
  { icon: Droplets,     label: 'Plumber',     color: '#e0f2fe', iconColor: '#0284c7' },
  { icon: PaintBucket,  label: 'Painter',     color: '#fce7f3', iconColor: '#db2777' },
  { icon: Hammer,       label: 'Carpenter',   color: '#fef3ec', iconColor: 'var(--orange)' },
  { icon: BrickWall,    label: 'Mason',       color: '#f0fdf4', iconColor: '#16a34a' },
  { icon: Wrench,       label: 'Welder',      color: '#f5f3ff', iconColor: '#7c3aed' },
];

const HOW = [
  { num: '01', title: 'Search your trade', desc: 'Browse fundis by trade and neighbourhood across Nairobi.' },
  { num: '02', title: 'View profiles & reviews', desc: 'Check ratings, experience, and hourly rates before you decide.' },
  { num: '03', title: 'Send a booking request', desc: 'Describe your job, pick a time, and send your request — free.' },
  { num: '04', title: 'Get the job done', desc: 'Your fundi confirms and shows up. Leave a review when done.' },
];

export default function Home() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #fff8f3 0%, #edfaf3 100%)', padding: '72px 20px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }} className="animate-fadeUp">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--orange-light)', border: '1px solid var(--orange-mid)', borderRadius: 20, padding: '5px 14px', fontSize: 13, fontWeight: 600, color: 'var(--orange)', marginBottom: 24 }}>
            <Star size={14} fill="var(--orange)" color="var(--orange)" /> Trusted by thousands of Nairobi households
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(36px, 6vw, 58px)', lineHeight: 1.15, color: 'var(--gray-800)', marginBottom: 20 }}>
            Find a trusted fundi<br />
            <span style={{ color: 'var(--orange)' }}>in your neighbourhood</span>
          </h1>
          <p style={{ fontSize: 18, color: 'var(--gray-600)', marginBottom: 36, lineHeight: 1.7 }}>
            Connect with vetted plumbers, electricians, painters, carpenters and more — all rated and reviewed by your neighbours.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn size="lg" onClick={() => navigate('/browse')}>Find a Fundi <ArrowRight size={16} /></Btn>
            <Btn size="lg" variant="secondary" onClick={() => navigate('/register?role=fundi')}>List my services</Btn>
          </div>
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
            {['200+ verified fundis', 'All Nairobi areas', 'Free to use'].map(t => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--gray-600)', fontWeight: 500 }}>
                <CheckCircle size={15} color="var(--teal)" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trades */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 20px' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, textAlign: 'center', marginBottom: 8 }}>Browse by trade</h2>
        <p style={{ textAlign: 'center', color: 'var(--gray-400)', marginBottom: 40 }}>Whatever the job, we have the right person for it.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }} className="stagger">
          {TRADES.map(({ icon: Icon, label, color, iconColor }) => (
            <div key={label} className="animate-fadeUp" onClick={() => navigate(`/browse?trade=${label}`)}
              style={{ background: color, borderRadius: 'var(--radius-lg)', padding: '24px 16px', textAlign: 'center', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', border: '1px solid transparent' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Icon size={24} color={iconColor} />
              </div>
              <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--gray-800)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: 'var(--gray-50)', padding: '64px 20px', borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, textAlign: 'center', marginBottom: 8 }}>How it works</h2>
          <p style={{ textAlign: 'center', color: 'var(--gray-400)', marginBottom: 48 }}>Getting help is as simple as 1-2-3-4.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }} className="stagger">
            {HOW.map(({ num, title, desc }) => (
              <div key={num} className="animate-fadeUp" style={{ background: '#fff', borderRadius: 'var(--radius-lg)', padding: 24, border: '1px solid var(--gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: 'var(--orange)', opacity: 0.3, lineHeight: 1, marginBottom: 12 }}>{num}</div>
                <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--gray-800)', padding: '64px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, color: '#fff', marginBottom: 14 }}>Are you a fundi?</h2>
          <p style={{ color: 'var(--gray-400)', fontSize: 16, marginBottom: 32 }}>List your services for free and get connected with customers in your area.</p>
          <Btn size="lg" onClick={() => navigate('/register?role=fundi')} style={{ background: 'var(--orange)' }}>
            Create your fundi profile <ArrowRight size={16} />
          </Btn>
        </div>
      </section>
    </div>
  );
}
