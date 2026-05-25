import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingsContext';
import { getAllFundis } from '../data/seed';
import { Card, Avatar, Badge, Stars, Btn, Input, Select, Textarea, toast } from '../components/UI';
import { Search, MapPin, SlidersHorizontal, X, Briefcase, Clock } from 'lucide-react';

const TRADES = ['All','Electrician','Plumber','Painter','Carpenter','Mason','Welder','Cleaner','Tiler','Roofer'];
const LOCATIONS = ['All areas','Westlands','Kibera','Kasarani','Langata','Embakasi','Karen','Ruaraka','Industrial Area'];

export default function Browse() {
  const [params] = useSearchParams();
  const [fundis, setFundis] = useState([]);
  const [search, setSearch] = useState('');
  const [trade, setTrade] = useState(params.get('trade') || 'All');
  const [location, setLocation] = useState('All areas');
  const [sortBy, setSortBy] = useState('rating');
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { setFundis(getAllFundis()); }, []);

  const filtered = fundis
    .filter(f => {
      const q = search.toLowerCase();
      const matchQ = !q || f.name.toLowerCase().includes(q) || f.trade.toLowerCase().includes(q) || f.bio?.toLowerCase().includes(q);
      const matchT = trade === 'All' || f.trade === trade;
      const matchL = location === 'All areas' || f.location === location;
      return matchQ && matchT && matchL;
    })
    .sort((a, b) => sortBy === 'rating' ? (b.rating || 0) - (a.rating || 0) : a.rate - b.rate);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, marginBottom: 6 }}>Find a fundi</h1>
        <p style={{ color: 'var(--gray-400)', fontSize: 15 }}>{filtered.length} fundi{filtered.length !== 1 ? 's' : ''} available</p>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-lg)', padding: '16px 20px', marginBottom: 24, boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: 12, alignItems: 'end' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)', pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, trade, or keyword..."
              style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--gray-200)', fontSize: 14, outline: 'none', fontFamily: 'var(--font-sans)', color: 'var(--gray-800)' }}
              onFocus={e => e.target.style.borderColor = 'var(--orange)'}
              onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
            />
          </div>
          <select value={trade} onChange={e => setTrade(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--gray-200)', fontSize: 14, fontFamily: 'var(--font-sans)', background: '#fff', color: 'var(--gray-800)', outline: 'none', cursor: 'pointer' }}>
            {TRADES.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={location} onChange={e => setLocation(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--gray-200)', fontSize: 14, fontFamily: 'var(--font-sans)', background: '#fff', color: 'var(--gray-800)', outline: 'none', cursor: 'pointer' }}>
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--gray-200)', fontSize: 14, fontFamily: 'var(--font-sans)', background: '#fff', color: 'var(--gray-800)', outline: 'none', cursor: 'pointer' }}>
            <option value="rating">Top rated</option>
            <option value="rate">Lowest rate</option>
          </select>
        </div>
      </div>

      {/* Trade chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {TRADES.filter(t => t !== 'All').map(t => (
          <button key={t} onClick={() => setTrade(trade === t ? 'All' : t)}
            style={{ padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: trade === t ? '1.5px solid var(--orange)' : '1.5px solid var(--gray-200)', background: trade === t ? 'var(--orange-light)' : '#fff', color: trade === t ? 'var(--orange)' : 'var(--gray-600)', transition: 'all 0.15s' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Fundi Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-400)' }}>
          <Search size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
          <p style={{ fontSize: 16, fontWeight: 500 }}>No fundis found</p>
          <p style={{ fontSize: 13, marginTop: 6 }}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }} className="stagger">
          {filtered.map(f => (
            <FundiCard key={f.id} fundi={f} onBook={() => {
              if (!user) { navigate('/login'); return; }
              setSelected(f);
            }} />
          ))}
        </div>
      )}

      {selected && (
        <BookingModal fundi={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function FundiCard({ fundi: f, onBook }) {
  return (
    <Card style={{ padding: 20 }} hover>
      <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
        <Avatar name={f.name} size={52} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
            <p style={{ fontWeight: 700, fontSize: 15 }}>{f.name}</p>
            <Badge color={f.available ? 'teal' : 'amber'}>{f.available ? 'Available' : 'Busy'}</Badge>
          </div>
          <p style={{ fontSize: 13, color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
            <Briefcase size={12} /> {f.trade}
          </p>
          <Stars rating={f.rating} count={f.reviews?.length} />
        </div>
      </div>

      {f.bio && <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{f.bio}</p>}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid var(--gray-100)' }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15 }}>KSh {f.rate}<span style={{ fontWeight: 400, fontSize: 12, color: 'var(--gray-400)' }}>/hr</span></p>
          <p style={{ fontSize: 12, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
            <MapPin size={11} /> {f.location}
          </p>
        </div>
        <Btn size="sm" onClick={onBook}>Book now</Btn>
      </div>
    </Card>
  );
}

function BookingModal({ fundi, onClose }) {
  const { user } = useAuth();
  const { createBooking } = useBookings();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', date: '', description: '' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description.trim() || !form.date) { toast('Please fill in all fields', 'error'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    createBooking({ fundiId: fundi.id, fundiName: fundi.name, customerId: user?.id || 'guest', customerName: form.name, customerPhone: form.phone, description: form.description, date: form.date });
    setLoading(false);
    toast(`Booking request sent to ${fundi.name}!`);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="animate-fadeUp" style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: '28px 28px', width: '100%', maxWidth: 460, boxShadow: 'var(--shadow-lg)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Avatar name={fundi.name} size={44} />
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>Book {fundi.name}</h2>
              <p style={{ fontSize: 13, color: 'var(--gray-400)' }}>{fundi.trade} · {fundi.location}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', padding: 4 }}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <Input label="Your name" value={form.name} onChange={set('name')} placeholder="e.g. Grace Otieno" required />
          <Input label="Phone number" type="tel" value={form.phone} onChange={set('phone')} placeholder="0712 345 678" required />
          <Input label="Preferred date & time" type="datetime-local" value={form.date} onChange={set('date')} required />
          <Textarea label="Describe the job" value={form.description} onChange={set('description')} placeholder="e.g. Leaking kitchen pipe, need repair urgently..." required rows={3} />
          <Btn type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Sending...' : 'Send booking request'}
          </Btn>
        </form>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-400)', marginTop: 12 }}>
          {fundi.name} will confirm within a few hours.
        </p>
      </div>
    </div>
  );
}
