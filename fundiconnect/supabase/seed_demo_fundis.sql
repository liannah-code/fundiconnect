-- Run this once in the Supabase SQL Editor to populate demo fundis.
-- These rows go straight into `profiles` and don't require matching
-- auth.users accounts, since the "Profiles are viewable by everyone"
-- policy allows public SELECT regardless of who owns the row.
--
-- NOTE: Because these fundis have no real auth account, they can't log in
-- or manage bookings — they're just there so Browse isn't empty while you test.
-- You can delete them later with:
--   delete from profiles where email like '%@demo.com';

insert into profiles (name, email, phone, role, trade, location, rate, bio, available, rating, jobs_done)
values
  ('James Mwangi',  'james@demo.com',  '0712 345 001', 'fundi', 'Electrician', 'Westlands',      600, 'Certified electrician with 8 years of experience. Residential wiring, solar installations, repairs.', true,  4.7, 38),
  ('Fatuma Hassan', 'fatuma@demo.com', '0722 345 002', 'fundi', 'Plumber',     'Kibera',         450, 'Expert plumber — pipe installations, leaks, borehole connections. Available 7 days a week.',         true,  4.9, 62),
  ('Peter Njoroge', 'peter@demo.com',  '0733 345 003', 'fundi', 'Painter',     'Kasarani',       350, 'Interior & exterior painting. I use high-quality paints and deliver clean finishes on time.',        false, 4.5, 21),
  ('Agnes Wanjiku', 'agnes@demo.com',  '0744 345 004', 'fundi', 'Carpenter',   'Langata',        550, 'Custom furniture, kitchen cabinets, doors & windows. 10+ years experience, own tools.',              true,  4.8, 44),
  ('John Omondi',   'john@demo.com',   '0755 345 005', 'fundi', 'Mason',       'Embakasi',       500, 'Stonework, tiling, foundations and plastering. Trusted by over 40 households across Nairobi.',       true,  4.6, 29),
  ('Rose Kamau',    'rose@demo.com',   '0766 345 006', 'fundi', 'Plumber',     'Westlands',      480, 'Specialise in modern bathroom fittings, geyser installations and drainage systems.',                 false, 4.4, 17),
  ('David Kipchoge','david@demo.com',  '0777 345 007', 'fundi', 'Welder',      'Industrial Area',700, 'Structural and decorative welding. Gates, window grills, staircases. Own equipment.',                true,  4.9, 51),
  ('Naomi Achieng', 'naomi@demo.com',  '0788 345 008', 'fundi', 'Cleaner',     'Karen',          250, 'Deep cleaning, post-construction cleaning, regular house cleaning. Reliable and thorough.',          true,  4.7, 76);
