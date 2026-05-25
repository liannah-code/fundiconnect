import { createContext, useContext, useState, useCallback } from 'react';

const BookingsContext = createContext(null);
const BOOKINGS_KEY = 'fc_bookings';

function getAll() {
  try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]'); }
  catch { return []; }
}

export function BookingsProvider({ children }) {
  const [bookings, setBookings] = useState(getAll);

  const save = (list) => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
    setBookings(list);
  };

  const createBooking = useCallback(({ fundiId, fundiName, customerId, customerName, customerPhone, description, date }) => {
    const booking = {
      id: Date.now().toString(),
      fundiId, fundiName,
      customerId, customerName, customerPhone,
      description, date,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    const updated = [booking, ...getAll()];
    save(updated);
    return booking;
  }, []);

  const updateStatus = useCallback((id, status) => {
    const updated = getAll().map(b => b.id === id ? { ...b, status } : b);
    save(updated);
  }, []);

  const addReview = useCallback(({ bookingId, fundiId, rating, comment, reviewerName }) => {
    // store review on booking
    const bkgs = getAll().map(b => b.id === bookingId ? { ...b, review: { rating, comment, reviewerName, date: new Date().toISOString() } } : b);
    save(bkgs);

    // update fundi's reviews in users store
    const USERS_KEY = 'fc_users';
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const idx = users.findIndex(u => u.id === fundiId);
      if (idx !== -1) {
        const reviews = [...(users[idx].reviews || []), { rating, comment, reviewerName, date: new Date().toISOString() }];
        const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
        users[idx] = { ...users[idx], reviews, rating: parseFloat(avg), jobsDone: (users[idx].jobsDone || 0) + 1 };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch {}
  }, []);

  const forFundi = useCallback((fundiId) => bookings.filter(b => b.fundiId === fundiId), [bookings]);
  const forCustomer = useCallback((customerId) => bookings.filter(b => b.customerId === customerId), [bookings]);

  return (
    <BookingsContext.Provider value={{ bookings, createBooking, updateStatus, addReview, forFundi, forCustomer }}>
      {children}
    </BookingsContext.Provider>
  );
}

export function useBookings() { return useContext(BookingsContext); }
