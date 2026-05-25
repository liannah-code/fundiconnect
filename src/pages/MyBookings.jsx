import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../context/BookingsContext';
import { Card, Badge, Avatar, Btn, Textarea, toast } from '../components/UI';
import { Clock, CheckCircle, Star, X } from 'lucide-react';

export default function MyBookings() {
  const { user } = useAuth();
  const { forCustomer, addReview } = useBookings();
  const [tab, setTab] = useState('all');
  const [reviewTarget, setReviewTarget] = useState(null);
  const bookings = forCustomer(user.id);

  const filtered = tab === 'all' ? bookings : bookings.filter(b => b.status === tab);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 30, marginBottom: 6 }}>My Bookings</h1>
      <p style={{ color: 'var(--gray-400)', marginBottom: 24 }}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''} total</p>

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
          <p>No bookings here yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(b => {
            const statusColors = { pending: 'amber', accepted: 'teal', completed: 'green', declined: 'gray' };
            const canReview = b.status === 'completed' && !b.review;
            return (
              <Card key={b.id} style={{ padding: 20 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <Avatar name={b.fundiName} size={44} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>{b.fundiName}</p>
                      <Badge color={statusColors[b.status] || 'gray'}>{b.status}</Badge>
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 4 }}>{b.description}</p>
                    <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                      {b.date ? new Date(b.date).toLocaleString() : 'Date TBD'} · Booked {new Date(b.createdAt).toLocaleDateString()}
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
        <ReviewModal booking={reviewTarget} userName={user.name} onClose={() => setReviewTarget(null)} onSubmit={(rating, comment) => {
          addReview({ bookingId: reviewTarget.id, fundiId: reviewTarget.fundiId, rating, comment, reviewerName: user.name });
          toast('Review submitted — thank you!');
          setReviewTarget(null);
        }} />
      )}
    </div>
  );
}

function ReviewModal({ booking, userName, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="animate-fadeUp" style={{ background: '#fff', borderRadius: 'var(--radius-xl)', padding: 28, width: '100%', maxWidth: 400, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Review {booking.fundiName}</h2>
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

        <Btn fullWidth disabled={!rating || !comment.trim()} onClick={() => onSubmit(rating, comment)}>Submit review</Btn>
      </div>
    </div>
  );
}
