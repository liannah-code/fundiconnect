import { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const BookingsContext = createContext(null);

export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState([]);

  /** Create a new booking request */
  const createBooking = useCallback(async ({ fundiId, fundiName, customerId, customerName, customerPhone, description, date }) => {
    const { data, error } = await supabase.from('bookings').insert({
      fundi_id: fundiId,
      fundi_name: fundiName,
      customer_id: customerId,
      customer_name: customerName,
      customer_phone: customerPhone,
      description,
      date,
      status: 'pending',
    }).select().single();

    if (error) return { error: error.message };
    setBookings(b => [data, ...b]);
    return { booking: data };
  }, []);

  /** Update a booking's status (accepted / declined / completed) */
  const updateStatus = useCallback(async (id, status) => {
    const { data, error } = await supabase.from('bookings').update({ status }).eq('id', id).select().single();
    if (error) return { error: error.message };
    setBookings(b => b.map(x => x.id === id ? data : x));

    // If marking complete, bump the fundi's jobs_done count
    if (status === 'completed' && data.fundi_id) {
      const { data: profile } = await supabase.from('profiles').select('jobs_done').eq('id', data.fundi_id).maybeSingle();
      if (profile) {
        await supabase.from('profiles').update({ jobs_done: (profile.jobs_done || 0) + 1 }).eq('id', data.fundi_id);
      }
    }
    return { booking: data };
  }, []);

  /** Add a review for a completed booking, and recalc the fundi's average rating */
  const addReview = useCallback(async ({ bookingId, fundiId, rating, comment, reviewerName }) => {
    const { error: reviewError } = await supabase.from('reviews').insert({
      booking_id: bookingId,
      fundi_id: fundiId,
      rating,
      comment,
      reviewer_name: reviewerName,
    });
    if (reviewError) return { error: reviewError.message };

    // recalc average rating for the fundi
    const { data: reviews } = await supabase.from('reviews').select('rating').eq('fundi_id', fundiId);
    if (reviews && reviews.length) {
      const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
      await supabase.from('profiles').update({ rating: parseFloat(avg) }).eq('id', fundiId);
    }

    setBookings(b => b.map(x => x.id === bookingId ? { ...x, review: { rating, comment, reviewer_name: reviewerName } } : x));
    return { success: true };
  }, []);

  /** Fetch all bookings for a given fundi, including any reviews left on them */
  const forFundi = useCallback(async (fundiId) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, reviews(*)')
      .eq('fundi_id', fundiId)
      .order('created_at', { ascending: false });
    if (error) { console.error(error.message); return []; }
    const mapped = data.map(b => ({ ...b, review: b.reviews?.[0] || null }));
    setBookings(prev => {
      const others = prev.filter(p => p.fundi_id !== fundiId);
      return [...mapped, ...others];
    });
    return mapped;
  }, []);

  /** Fetch all bookings for a given customer, including any reviews left on them */
  const forCustomer = useCallback(async (customerId) => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, reviews(*)')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });
    if (error) { console.error(error.message); return []; }
    const mapped = data.map(b => ({ ...b, review: b.reviews?.[0] || null }));
    setBookings(prev => {
      const others = prev.filter(p => p.customer_id !== customerId);
      return [...mapped, ...others];
    });
    return mapped;
  }, []);

  return (
    <BookingsContext.Provider value={{ bookings, createBooking, updateStatus, addReview, forFundi, forCustomer }}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() { return useContext(BookingsContext); }
