# FundiConnect

A community marketplace connecting local fundis (tradespeople) with customers across Nairobi.

## Tech Stack
- **React 18** with React Router v6
- **localStorage** for data persistence (replace with Supabase for production)
- **lucide-react** for icons
- **Plus Jakarta Sans** + **DM Serif Display** fonts (Google Fonts)

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 16+ installed ([nodejs.org](https://nodejs.org))
- npm or yarn

### 1. Install dependencies
```bash
cd fundiconnect
npm install
```

### 2. Start the development server
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top navigation bar
│   ├── ProtectedRoute.jsx  # Auth guard for private routes
│   └── UI.jsx              # Shared UI components (Button, Input, Card, etc.)
├── context/
│   ├── AuthContext.jsx     # User auth state (register, login, logout)
│   └── BookingsContext.jsx # Booking state (create, update, review)
├── data/
│   └── seed.js             # Demo fundi data
├── pages/
│   ├── Home.jsx            # Landing page
│   ├── Browse.jsx          # Search & book fundis
│   ├── Register.jsx        # Sign up (customer or fundi)
│   ├── Login.jsx           # Log in
│   ├── FundiDashboard.jsx  # Fundi's job management
│   └── MyBookings.jsx      # Customer's booking history + reviews
├── App.jsx                 # Routes
├── index.css               # Global styles & design tokens
└── index.js                # Entry point
```

---

## Features

### For Customers
- Browse and search fundis by trade, location, and keyword
- View fundi profiles with ratings, reviews, and rates
- Send booking requests with job description and preferred time
- Track booking status (pending → accepted → completed)
- Leave star ratings and written reviews after job completion

### For Fundis
- Register with trade, location, rate, and bio
- Dashboard with stats (jobs done, pending requests, rating, rate)
- Accept or decline incoming booking requests
- Mark jobs as completed
- Toggle availability status (Available / Busy)
- View all customer reviews

---

## Deploying to Production

### Option 1: Vercel (Recommended — free)
```bash
npm install -g vercel
vercel
```
Follow the prompts. Your site will be live at `your-app.vercel.app`.

### Option 2: Netlify
```bash
npm run build
```
Then drag the `build/` folder to [netlify.com/drop](https://app.netlify.com/drop).

### Option 3: Custom domain
1. Buy `fundiconnect.co.ke` at [kenic.or.ke](https://www.kenic.or.ke) or Namecheap
2. Deploy to Vercel/Netlify
3. Add the custom domain in your hosting dashboard

---

## Upgrading to a Real Backend (Supabase)

The app currently uses localStorage for all data. To upgrade to a real database:

### 1. Create a Supabase project at [supabase.com](https://supabase.com) (free tier)

### 2. Install the client
```bash
npm install @supabase/supabase-js
```

### 3. Create these tables in Supabase

```sql
-- Users (handled by Supabase Auth)
-- Extend with a profiles table:
create table profiles (
  id uuid references auth.users primary key,
  name text,
  phone text,
  role text check (role in ('fundi', 'customer')),
  trade text,
  location text,
  rate integer,
  bio text,
  available boolean default true,
  created_at timestamptz default now()
);

create table bookings (
  id uuid primary key default gen_random_uuid(),
  fundi_id uuid references profiles(id),
  customer_id uuid references profiles(id),
  description text,
  date timestamptz,
  status text default 'pending' check (status in ('pending','accepted','completed','declined')),
  created_at timestamptz default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  fundi_id uuid references profiles(id),
  rating integer check (rating between 1 and 5),
  comment text,
  reviewer_name text,
  created_at timestamptz default now()
);
```

### 4. Replace AuthContext and BookingsContext
Swap localStorage calls with `supabase.auth.signUp()`, `supabase.from('bookings').insert()`, etc.

---

## Adding M-Pesa Payments

To accept M-Pesa deposits for bookings:

1. Sign up at [Safaricom Developer Portal](https://developer.safaricom.co.ke)
2. Use the **M-Pesa STK Push API** (Lipa Na M-Pesa Online)
3. Create a backend endpoint (Node.js/Express or Supabase Edge Function) to trigger the STK push
4. Add a "Pay deposit" button on the booking confirmation screen

---

## SMS Notifications (Africa's Talking)

To notify fundis of new bookings via SMS:
1. Sign up at [africastalking.com](https://africastalking.com)
2. Use their SMS API in a Supabase Edge Function triggered by a new booking insert
3. Send: "New booking from [Customer] for [Job] on [Date]. Log in to respond."

---

## Environment Variables

Create a `.env` file in the root:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_AT_API_KEY=your_africas_talking_key
```

---

## Demo Accounts

Log in with these pre-seeded accounts (password: `demo`):
- `james@demo.com` — James Mwangi (Electrician, Westlands)
- `fatuma@demo.com` — Fatuma Hassan (Plumber, Kibera)

Or register a new account from the sign-up page.
