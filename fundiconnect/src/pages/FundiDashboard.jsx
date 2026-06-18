import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingsContext';
import { supabase } from '../lib/supabase';
import { Avatar, Badge, Stars, StatCard, Card, Btn, toast, PageLoader } from '../components/UI';
import { Briefcase, Clock, CheckCircle, DollarSign, Star, MapPin, Phone, ToggleLeft, ToggleRight } from 'lucide-react';

export default function FundiDashboard() {
  const { user, updateUser } = useAuth();
  const { forFundi, updateStatus } = useBookings();
  const [tab, setTab] = useState('requests');
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [reviews, setReviews] = useState([]);

  const refresh = useCallback(async () => {
    setLoadingBookings(true);
    const data = await forFundi(user.id);
    setBookings(data);
    setLoadingBookings(false);
  }, [forFundi, user.id]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    supabase
      .from('reviews')
      .select('*')
      .eq('fundi_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) { console.error('Error fetching reviews:', error.message); return; }
        setReviews(data || []);
      });
  }, [user.id]);

  const pending   = bookings.filter(b => b.status === 'pending');
  const accepted  = bookings.filter(b => b.status === 'accepted');
  const completed = bookings.filter(b => b.status === 'completed');

  const toggleAvailability = async () => {
    const result = await updateUser({ available: !user.available });
    if (result.error) { toast(result.error, 'error'); return; }
    toast(user.available ? 'You are now marked as Busy' : 'You are now Available');
  };

  const handle = async (id, status) => {
    const result = await updateStatus(id, status);
    if (result.error) { toast(result.error, 'error'); return; }
    toast(status === 'accepted' ? 'Booking accepted!' : status === 'completed' ? 'Marked as completed!' : 'Booking declined.');
    refresh();
  };

  if (loadingBookings && bookings.length === 0) {
    return <PageLoader />;
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px' }}>
      {/* Profile header */}
      <Card style={{ padding: '24px', marginBottom: 24, display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <Avatar name={user.name} size={64} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 26 }}>{user.name}</h1>
            <Badge color={user.available ? 'teal' : 'amber'}>{user.available ? 'Available' : 'Busy'}</Badge>
          </div>
          <p style={{ fontSize: 14, color: 'var(--gray-600)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Briefcase size={13} />{user.trade}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} />{user.location}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={13} />{user.phone}</span>
          </p>
          {user.rating && <div style={{ marginTop: 6 }}><Stars rating={user.rating} count={reviews.length} /></div>}
        </div>
        <button onClick={toggleAvailability}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--gray-200)', background: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'var(--gray-600)' }}>
          {user.available ? <ToggleRight size={20} color="var(--teal)" /> : <ToggleLeft size={20} />}
          {user.available ? 'Set as Busy' : 'Set as Available'}
        </button>
      </Card>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 28 }}>
        <StatCard label="Jobs done" value={user.jobs_done || 0} icon={CheckCircle} color="var(--teal)" />
        <StatCard label="Pending requests" value={pending.length} icon={Clock} color="var(--orange)" />
        <StatCard label="Rating" value={user.rating ? `${user.rating} ★` : '—'} icon={Star} color="#ca8a04" />
        <StatCard label="Rate" value={`KSh ${user.rate}/hr`} icon={DollarSign} color="var(--gray-600)" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--gray-100)', padding: 4, borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
        {[['requests', `Requests (${pending.length})`], ['active', `Active (${accepted.length})`], ['completed', `Completed (${completed.length})`], ['reviews', `Reviews (${reviews.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: tab === key ? '#fff' : 'transparent', color: tab === key ? 'var(--gray-800)' : 'var(--gray-400)', boxShadow: tab === key ? 'var(--shadow-sm)' : 'none', transition: 'all 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'requests' && (
        <div>
          {pending.length === 0 ? <EmptyState icon={Clock} text="No pending requests right now" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pending.map(b => <BookingCard key={b.id} b={b} actions={[
                { label: 'Accept', color: 'teal', onClick: () => handle(b.id, 'accepted') },
                { label: 'Decline', color: 'secondary', onClick: () => handle(b.id, 'declined') },
              ]} />)}
            </div>
          )}
        </div>
      )}

      {tab === 'active' && (
        <div>
          {accepted.length === 0 ? <EmptyState icon={Briefcase} text="No active jobs at the moment" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {accepted.map(b => <BookingCard key={b.id} b={b} actions={[
                { label: 'Mark complete', color: 'primary', onClick: () => handle(b.id, 'completed') },
              ]} />)}
            </div>
          )}
        </div>
      )}

      {tab === 'completed' && (
        <div>
          {completed.length === 0 ? <EmptyState icon={CheckCircle} text="No completed jobs yet" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {completed.map(b => <BookingCard key={b.id} b={b} />)}
            </div>
          )}
        </div>
      )}

      {tab === 'reviews' && (
        <div>
          {reviews.length === 0 ? <EmptyState icon={Star} text="No reviews yet — they'll appear here after completed jobs" /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map((r) => (
                <Card key={r.id} style={{ padding: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Stars rating={r.rating} />
                    <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: 14, color: 'var(--gray-700)', fontStyle: 'italic' }}>"{r.comment}"</p>
                  <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 6 }}>— {r.reviewer_name}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BookingCard({ b, actions = [] }) {
  const statusColors = { pending: 'amber', accepted: 'teal', completed: 'green', declined: 'gray' };
  return (
    <Card style={{ padding: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <p style={{ fontWeight: 700, fontSize: 15 }}>{b.customer_name}</p>
            <Badge color={statusColors[b.status] || 'gray'}>{b.status}</Badge>
          </div>
          <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4 }}>{b.description}</p>
          <p style={{ fontSize: 12, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span><Phone size={11} style={{ verticalAlign: 'middle' }} /> {b.customer_phone}</span>
            <span><Clock size={11} style={{ verticalAlign: 'middle' }} /> {b.date ? new Date(b.date).toLocaleString() : 'Date TBD'}</span>
          </p>
        </div>
        {actions.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {actions.map(a => <Btn key={a.label} size="sm" variant={a.color} onClick={a.onClick}>{a.label}</Btn>)}
          </div>
        )}
      </div>
    </Card>
  );
}

function EmptyState({ icon: Icon, text }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
      <Icon size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
      <p style={{ fontSize: 15 }}>{text}</p>
    </div>
  );
}
