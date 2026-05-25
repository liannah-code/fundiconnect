import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './UI';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--gray-200)',
      height: 'var(--nav-height)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--orange)' }}>fundi</span>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--gray-800)' }}>connect</span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {!user && (
            <>
              <NavLink to="/browse" active={isActive('/browse')}>Find a Fundi</NavLink>
              <NavLink to="/login" active={isActive('/login')}>Log in</NavLink>
              <Link to="/register" style={{ marginLeft: 8, padding: '8px 18px', background: 'var(--orange)', color: '#fff', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 600, transition: 'background 0.15s' }}
                onMouseEnter={e => e.target.style.background = 'var(--orange-hover)'}
                onMouseLeave={e => e.target.style.background = 'var(--orange)'}>
                Get started
              </Link>
            </>
          )}

          {user && (
            <>
              <NavLink to="/browse" active={isActive('/browse')}>Find a Fundi</NavLink>
              {user.role === 'fundi' && <NavLink to="/dashboard" active={isActive('/dashboard')}>My Dashboard</NavLink>}
              {user.role === 'customer' && <NavLink to="/my-bookings" active={isActive('/my-bookings')}>My Bookings</NavLink>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8, paddingLeft: 12, borderLeft: '1px solid var(--gray-200)' }}>
                <Avatar name={user.name} size={32} />
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-800)' }}>{user.name.split(' ')[0]}</span>
                <button onClick={handleLogout} title="Log out"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', padding: 4, borderRadius: 6 }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--orange)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-400)'}>
                  <LogOut size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link to={to} style={{
      padding: '6px 14px', borderRadius: 'var(--radius-md)', fontSize: 14, fontWeight: 500,
      color: active ? 'var(--orange)' : 'var(--gray-600)',
      background: active ? 'var(--orange-light)' : 'transparent',
      transition: 'all 0.15s',
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--gray-100)'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
      {children}
    </Link>
  );
}
