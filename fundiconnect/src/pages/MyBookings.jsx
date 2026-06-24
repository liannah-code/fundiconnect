import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingsContext';
import { Card, Badge, Avatar, Btn, Textarea, toast, PageLoader } from '../components/UI';
import { Clock, Star, X } from 'lucide-react';

export default function MyBookings() {
  const { user } = useAuth();
  const { forCustomer, addReview } = useBookings();
  const [tab, setTab] = useState('all');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewTarget, setReviewTarget] = useState(null);

  const refresh = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const data = await forCustomer(user.id);
    setBookings(data);
    setLoading(false);
  }, [forCustomer, user?.id]);

  useEffect(() => { refresh(); }, [refresh]);

  const filtered = tab === 'all' ? bookings : bookings.filter(b => b.status === tab);

  if (loading && bookings.length === 0) return <PageLoader />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, marginBottom: 6 }}>Client Dashboard</h1>
      <p style={{ color: 'var(--gray-400)', marginBottom: 24 }}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} sent to fundis</p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'var(--gray-100)', padding: 4, borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
        {[['all','All'],['pending','Pending'],['accepted','Accepted'],['completed','Completed']].map(([key,label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: tab === key ? '#fff' : 'transparent', color: tab === key ? 'var(--gray-800)' : 'var(--gray-400)', boxShadow: tab === key ? 'var(--shadow-sm)' : 'none', transition: 'all 0.15s' }}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-400)' }}>
          <Clock size={36} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
          <p style={{ marginBottom: 16 }}>No bookings here yet. Find a fundi to send your first request.</p>
          <Link to="/browse" style={{ display: 'inline-flex', padding: '10px 18px', borderRadius: 'var(--radius-md)', background: 'var(--orange)', color: '#fff', fontWeight: 700, fontSize: 14 }}>
            Find a Fundi
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(b => {
            const statusColors = { pending: 'amber', accepted: 'teal', completed: 'green', declined: 'gray' };
            const canReview = b.status === 'completed' && !b.review;
            return (
              <Card key={b.id} style={{ padding: 20 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <Avatar name={b.fundi_name || 'Fundi'} size={44} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>{b.fundi_name || 'Fundi request'}</p>
                      <Badge color={statusColors[b.status] || 'gray'}>{b.status}</Badge>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4 }}>{b.description}</p>
                    <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                      {b.date ? new Date(b.date).toLocaleString() : 'Date TBD'} · Booked {new Date(b.created_at).toLocaleDateString()}
                    </p>
                    {b.review && (
                      <div style={{ marginTop: 10, padding: '8px 12px', background: 'var(--gray-50)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)' }}>
                        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                          {Array.from({ length: b.review.rating }, (_, i) => <Star key={i} size={13} fill="var(--orange)" color="var(--orange)" />)}
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--gray-600)', fontStyle: 'italic' }}>"{b.review.comment}"</p>
                      </div>
                    )}
                    {canReview && (
                      <div style={{ marginTop: 10 }}>
                        <Btn size="sm" variant="secondary" onClick={() => setReviewTarget(b)}>
                          <Star size={13} /> Leave a review
                        </Btn>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {reviewTarget && (
        <ReviewModal booking={reviewTarget} onClose={() => setReviewTarget(null)} onSubmit={async (rating, comment) => {
          const result = await addReview({ bookingId: reviewTarget.id, fundiId: reviewTarget.fundi_id, rating, comment, reviewerName: user.name });
          if (result.error) { toast(result.error, 'error'); return; }
          toast('Review submitted. Thank you!');
          setReviewTarget(null);
          refresh();
        }} />
      )}
    </div>
  );
}

function ReviewModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit(rating, comment);
    setSubmitting(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="animate-fadeUp" style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: 28, width: '100%', maxWidth: 400, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Review {booking.fundi_name}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}><X size={20} /></button>
        </div>

        <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 20 }}>How was your experience?</p>

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          {[1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setRating(s)} onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <Star size={32} fill={(hovered || rating) >= s ? 'var(--orange)' : 'transparent'} color={(hovered || rating) >= s ? 'var(--orange)' : 'var(--gray-200)'} />
            </button>
          ))}
        </div>

        <Textarea label="Your review" value={comment} onChange={e => setComment(e.target.value)} placeholder="Tell others about the quality of work, punctuality, and professionalism..." rows={3} />

        <Btn fullWidth disabled={!rating || !comment.trim() || submitting} onClick={handleSubmit}>
          {submitting ? 'Submitting...' : 'Submit review'}
        </Btn>
      </div>
    </div>
  );
}
