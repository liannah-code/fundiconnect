# FundiConnect

A community marketplace connecting local fundis (tradespeople) with customers across Nairobi — now powered by **Supabase** for real authentication and a live database.

## Tech Stack
- **React 18** + **Vite**
- **React Router v6**
- **Supabase** — Auth, Postgres database, Row Level Security
- **lucide-react** for icons
- **Plus Jakarta Sans** + **DM Serif Display** fonts (Google Fonts)

---

## 1. Set up Supabase

If you haven't already, follow the step-by-step guide to:
1. Create a Supabase project
2. Run the SQL to create `profiles`, `bookings`, and `reviews` tables
3. Enable Row Level Security + policies
4. Enable email auth (and turn off "Confirm email" for easier local testing)
5. Grab your **Project URL** and **anon public key** from Project Settings → API

### Seed demo fundis (optional)
Run `supabase/seed_demo_fundis.sql` in the SQL Editor to populate the Browse page with 8 sample fundis. These are read-only demo profiles — they don't have real login accounts, so don't worry about deleting them later if needed.

---

## 2. Configure environment variables

Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Then fill in your values:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```

**Never commit `.env` to git** — it's already in `.gitignore`.

---

## 3. Install & run

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx   # redirects to /login if not signed in, shows loader during session check
│   └── UI.jsx
├── context/
│   ├── AuthContext.jsx      # wraps Supabase Auth + profiles table
│   └── BookingsContext.jsx  # wraps bookings + reviews tables
├── data/
│   └── fundis.js            # fetches fundi profiles from Supabase
├── lib/
│   └── supabase.js          # Supabase client instance
├── pages/
│   ├── Home.jsx
│   ├── Browse.jsx
│   ├── Register.jsx
│   ├── Login.jsx
│   ├── FundiDashboard.jsx
│   └── MyBookings.jsx
├── App.jsx
├── index.css
└── index.jsx
supabase/
└── seed_demo_fundis.sql     # optional demo data
```

---

## How Auth Works

1. `register()` calls `supabase.auth.signUp()`, then inserts a row into `profiles` with the same `id` as the auth user.
2. `login()` calls `supabase.auth.signInWithPassword()`, then loads the matching `profiles` row.
3. `AuthContext` listens for `onAuthStateChange` so sessions persist across page reloads automatically (Supabase stores the session in browser storage).
4. `ProtectedRoute` shows a loader while the session is being checked, then redirects to `/login` if there's no user, or `/` if the role doesn't match the route.

---

## How Bookings & Reviews Work

- **Customers** create a booking via `createBooking()` → inserted into `bookings` with `status: 'pending'`.
- **Fundis** see pending requests on their dashboard and can `Accept`, `Decline`, or later `Mark complete` via `updateStatus()`.
- When a booking is marked `completed`, the fundi's `jobs_done` count increments automatically.
- **Customers** can leave a review on completed bookings via `addReview()`, which inserts into `reviews` and recalculates the fundi's average `rating`.

---

## Row Level Security Summary

| Table | Who can SELECT | Who can INSERT | Who can UPDATE |
|---|---|---|---|
| `profiles` | Everyone | Self only | Self only |
| `bookings` | The fundi or customer on the booking | Customer (as `customer_id`) | The fundi (status changes) |
| `reviews` | Everyone | The customer who owns the related booking | — |

---

## Deploying to Production

### Vercel (recommended)
```bash
npm install -g vercel
vercel
```
Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as Environment Variables in the Vercel project settings (Settings → Environment Variables) — they won't be picked up from `.env` automatically in production.

After deploying, go back to Supabase **Authentication → URL Configuration** and update the **Site URL** to your live Vercel URL.

### Netlify
```bash
npm run build
```
Drag the `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop), and add the same environment variables in Site settings → Environment variables.

---

## Next Steps

- **M-Pesa payments**: Add Lipa Na M-Pesa STK Push via a Supabase Edge Function for booking deposits
- **SMS notifications**: Use Africa's Talking in an Edge Function triggered by new rows in `bookings`
- **Profile photos**: Use Supabase Storage to let fundis upload a profile picture
- **Email confirmation**: Re-enable "Confirm email" in Supabase Auth before going live
