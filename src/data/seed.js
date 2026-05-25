// Seed the app with demo fundis on first load
const USERS_KEY = 'fc_users';

const DEMO_FUNDIS = [
  { id: 's1', name: 'James Mwangi',  email: 'james@demo.com',  phone: '0712 345 001', password: 'demo', role: 'fundi', trade: 'Electrician', location: 'Westlands',  rate: 600, bio: 'Certified electrician with 8 years of experience. Residential wiring, solar installations, repairs.', rating: 4.7, reviews: [{rating:5,comment:'Excellent work, very professional.',reviewerName:'Grace O.',date:'2024-11-01'},{rating:4,comment:'Fast and reliable.',reviewerName:'Peter K.',date:'2024-10-15'}], jobsDone: 38, available: true,  createdAt: '2024-01-01' },
  { id: 's2', name: 'Fatuma Hassan', email: 'fatuma@demo.com', phone: '0722 345 002', password: 'demo', role: 'fundi', trade: 'Plumber',      location: 'Kibera',     rate: 450, bio: 'Expert plumber — pipe installations, leaks, borehole connections. Available 7 days a week.',        rating: 4.9, reviews: [{rating:5,comment:'Fixed my burst pipe in under an hour!',reviewerName:'John M.',date:'2024-11-10'},{rating:5,comment:'Very clean and efficient.',reviewerName:'Rose W.',date:'2024-10-20'}], jobsDone: 62, available: true,  createdAt: '2024-01-01' },
  { id: 's3', name: 'Peter Njoroge', email: 'peter@demo.com',  phone: '0733 345 003', password: 'demo', role: 'fundi', trade: 'Painter',      location: 'Kasarani',   rate: 350, bio: 'Interior & exterior painting. I use high-quality paints and deliver clean finishes on time.',        rating: 4.5, reviews: [{rating:4,comment:'Good work, took slightly longer than quoted.',reviewerName:'Ann W.',date:'2024-11-05'}], jobsDone: 21, available: false, createdAt: '2024-01-01' },
  { id: 's4', name: 'Agnes Wanjiku', email: 'agnes@demo.com',  phone: '0744 345 004', password: 'demo', role: 'fundi', trade: 'Carpenter',    location: 'Langata',    rate: 550, bio: 'Custom furniture, kitchen cabinets, doors & windows. 10+ years experience, own tools.',          rating: 4.8, reviews: [{rating:5,comment:'Beautiful kitchen cabinets!',reviewerName:'Samuel N.',date:'2024-11-12'}], jobsDone: 44, available: true,  createdAt: '2024-01-01' },
  { id: 's5', name: 'John Omondi',   email: 'john@demo.com',   phone: '0755 345 005', password: 'demo', role: 'fundi', trade: 'Mason',         location: 'Embakasi',   rate: 500, bio: 'Stonework, tiling, foundations and plastering. Trusted by over 40 households across Nairobi.',   rating: 4.6, reviews: [{rating:5,comment:'Solid work on my extension.',reviewerName:'Mary K.',date:'2024-10-28'}], jobsDone: 29, available: true,  createdAt: '2024-01-01' },
  { id: 's6', name: 'Rose Kamau',    email: 'rose@demo.com',   phone: '0766 345 006', password: 'demo', role: 'fundi', trade: 'Plumber',      location: 'Westlands',  rate: 480, bio: 'Specialise in modern bathroom fittings, geyser installations and drainage systems.',             rating: 4.4, reviews: [], jobsDone: 17, available: false, createdAt: '2024-01-01' },
  { id: 's7', name: 'David Kipchoge',email: 'david@demo.com',  phone: '0777 345 007', password: 'demo', role: 'fundi', trade: 'Welder',        location: 'Industrial Area', rate: 700, bio: 'Structural and decorative welding. Gates, window grills, staircases. Own equipment.',         rating: 4.9, reviews: [{rating:5,comment:'My gate looks amazing.',reviewerName:'Lucy A.',date:'2024-11-15'}], jobsDone: 51, available: true,  createdAt: '2024-01-01' },
  { id: 's8', name: 'Naomi Achieng', email: 'naomi@demo.com',  phone: '0788 345 008', password: 'demo', role: 'fundi', trade: 'Cleaner',       location: 'Karen',      rate: 250, bio: 'Deep cleaning, post-construction cleaning, regular house cleaning. Reliable and thorough.',      rating: 4.7, reviews: [{rating:5,comment:'House sparkled after she was done.',reviewerName:'Brian O.',date:'2024-11-08'}], jobsDone: 76, available: true,  createdAt: '2024-01-01' },
];

export function seedDemoData() {
  const existing = localStorage.getItem(USERS_KEY);
  if (existing) {
    // ensure seed fundis are present
    try {
      const users = JSON.parse(existing);
      const hasSeeds = DEMO_FUNDIS.every(d => users.find(u => u.id === d.id));
      if (!hasSeeds) {
        const nonSeeds = users.filter(u => !DEMO_FUNDIS.find(d => d.id === u.id));
        localStorage.setItem(USERS_KEY, JSON.stringify([...DEMO_FUNDIS, ...nonSeeds]));
      }
    } catch {}
    return;
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_FUNDIS));
}

export function getAllFundis() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.filter(u => u.role === 'fundi');
  } catch { return []; }
}
