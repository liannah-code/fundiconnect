import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Badge, Card, PageLoader, StatCard } from '../components/UI';
import { Briefcase, CheckCircle, Clock, ShieldCheck, Star, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError('');
      const [profileRes, bookingRes, reviewRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
      ]);

      if (!active) return;
      const firstError = profileRes.error || bookingRes.error || reviewRes.error;
      if (firstError) {
        setError(firstError.message);
      }
      setProfiles(profileRes.data || []);
      setBookings(bookingRes.data || []);
      setReviews(reviewRes.data || []);
      setLoading(false);
    }

    load();
    return () => { active = false; };
  }, []);

  const stats = useMemo(() => {
    const fundis = profiles.filter(p => p.role === 'fundi');
    const customers = profiles.filter(p => p.role === 'customer');
    const completed = bookings.filter(b => b.status === 'completed');
    const pending = bookings.filter(b => b.status === 'pending');
    return { fundis, customers, completed, pending };
  }, [bookings, profiles]);

  if (loading) return <PageLoader />;

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderRadius: 999, background: 'var(--teal-light)', color: 'var(--teal)', fontSize: 12, fontWeight: 700, marginBottom: 10 }}>
            <ShieldCheck size={14} /> Admin
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, lineHeight: 1.15 }}>FundiConnect Admin</h1>
          <p style={{ color: 'var(--gray-600)', fontSize: 14, marginTop: 6 }}>Monitor fundis, customers, bookings, and service quality.</p>
        </div>
      </div>

      {error && (
        <Card style={{ padding: 16, marginBottom: 20, background: '#fff7ed', borderColor: '#fed7aa' }}>
          <p style={{ color: '#9a3412', fontSize: 14 }}>
            Some admin data could not be loaded. Check your Supabase Row Level Security policies for admin reads. Details: {error}
          </p>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard label="Total users" value={profiles.length} icon={Users} color="var(--teal)" />
        <StatCard label="Fundis" value={stats.fundis.length} icon={Briefcase} color="var(--orange)" />
        <StatCard label="Pending jobs" value={stats.pending.length} icon={Clock} color="#ca8a04" />
        <StatCard label="Completed jobs" value={stats.completed.length} icon={CheckCircle} color="var(--teal)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(280px, 0.8fr)', gap: 18 }}>
        <Card style={{ padding: 20 }}>
          <h2 style={{ fontSize: 18, marginBottom: 14 }}>Recent bookings</h2>
          {bookings.length === 0 ? (
            <Empty text="No bookings yet." />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bookings.slice(0, 8).map(booking => (
                <div key={booking.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, padding: '12px 0', borderBottom: '1px solid var(--gray-100)' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14 }}>{booking.customer_name || 'Customer'} to {booking.fundi_name || 'Fundi'}</p>
                    <p style={{ fontSize: 12, color: 'var(--gray-600)', marginTop: 2 }}>{booking.description || 'No description provided'}</p>
                  </div>
                  <Badge color={statusColor(booking.status)}>{booking.status || 'pending'}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card style={{ padding: 20 }}>
            <h2 style={{ fontSize: 18, marginBottom: 14 }}>Top fundis</h2>
            {stats.fundis.length === 0 ? (
              <Empty text="No fundis registered." />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {stats.fundis
                  .slice()
                  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                  .slice(0, 5)
                  .map(fundi => (
                    <div key={fundi.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 14 }}>{fundi.name || fundi.email}</p>
                        <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>{fundi.trade || 'Trade not set'} · {fundi.location || 'Area not set'}</p>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--orange)', fontSize: 13 }}>
                        <Star size={13} fill="var(--orange)" /> {fundi.rating || 'New'}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </Card>

          <Card style={{ padding: 20 }}>
            <h2 style={{ fontSize: 18, marginBottom: 14 }}>Reviews</h2>
            <p style={{ fontSize: 30, fontWeight: 800, lineHeight: 1 }}>{reviews.length}</p>
            <p style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 6 }}>Customer reviews submitted across completed jobs.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function statusColor(status) {
  return ({ pending: 'amber', accepted: 'teal', completed: 'green', declined: 'gray' })[status] || 'gray';
}

function Empty({ text }) {
  return <p style={{ color: 'var(--gray-400)', fontSize: 14, padding: '24px 0' }}>{text}</p>;
}
