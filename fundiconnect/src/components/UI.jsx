import { useState, useEffect } from 'react';
import { Star, StarHalf } from 'lucide-react';

/* ── Button ── */
export function Btn({ children, variant = 'primary', size = 'md', onClick, type = 'button', disabled, fullWidth, style }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: '8px', fontFamily: 'var(--font-sans)', fontWeight: 600,
    borderRadius: 'var(--radius-md)', cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none', transition: 'all 0.15s', width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.6 : 1, ...style,
  };
  const sizes = {
    sm:  { padding: '7px 14px', fontSize: '13px' },
    md:  { padding: '11px 20px', fontSize: '14px' },
    lg:  { padding: '14px 28px', fontSize: '15px' },
  };
  const variants = {
    primary:   { background: 'var(--orange)', color: '#fff' },
    secondary: { background: 'var(--gray-100)', color: 'var(--gray-800)', border: '1px solid var(--gray-200)' },
    teal:      { background: 'var(--teal)', color: '#fff' },
    ghost:     { background: 'transparent', color: 'var(--gray-600)', border: '1px solid var(--gray-200)' },
    danger:    { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {children}
    </button>
  );
}

/* ── Input ── */
export function Input({ label, name, type = 'text', value, onChange, placeholder, required, hint, error, prefix }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '6px' }}>{label}{required && <span style={{ color: 'var(--orange)', marginLeft: 2 }}>*</span>}</label>}
      <div style={{ position: 'relative' }}>
        {prefix && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--gray-400)', pointerEvents: 'none' }}>{prefix}</span>}
        <input name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
          style={{
            width: '100%', padding: prefix ? '10px 12px 10px 36px' : '10px 12px',
            borderRadius: 'var(--radius-sm)', fontSize: '14px',
            border: error ? '1.5px solid #f87171' : '1.5px solid var(--gray-200)',
            background: '#fff', color: 'var(--gray-800)', outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--orange)'}
          onBlur={e => e.target.style.borderColor = error ? '#f87171' : 'var(--gray-200)'}
        />
      </div>
      {error && <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

/* ── Select ── */
export function Select({ label, name, value, onChange, options, required }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '6px' }}>{label}{required && <span style={{ color: 'var(--orange)', marginLeft: 2 }}>*</span>}</label>}
      <select name={name} value={value} onChange={onChange} required={required}
        style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '14px', border: '1.5px solid var(--gray-200)', background: '#fff', color: 'var(--gray-800)', outline: 'none' }}
        onFocus={e => e.target.style.borderColor = 'var(--orange)'}
        onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
      >
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}

/* ── Textarea ── */
export function Textarea({ label, name, value, onChange, placeholder, required, rows = 3 }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '6px' }}>{label}{required && <span style={{ color: 'var(--orange)', marginLeft: 2 }}>*</span>}</label>}
      <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} required={required} rows={rows}
        style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '14px', border: '1.5px solid var(--gray-200)', background: '#fff', color: 'var(--gray-800)', outline: 'none', resize: 'vertical', fontFamily: 'var(--font-sans)' }}
        onFocus={e => e.target.style.borderColor = 'var(--orange)'}
        onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
      />
    </div>
  );
}

/* ── Card ── */
export function Card({ children, style, onClick, hover = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--gray-200)',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'box-shadow 0.2s, transform 0.2s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}>{children}</div>
  );
}

/* ── Avatar ── */
const COLORS = [
  ['#FEF3EC','#E8621A'], ['#E0F5EF','#0f7c5e'], ['#FEF9EC','#BA7517'],
  ['#E6F1FB','#185FA5'], ['#EAF3DE','#3B6D11'], ['#F3E8FE','#7c3aed'],
];
export function Avatar({ name = '', size = 44 }) {
  const idx = name.charCodeAt(0) % COLORS.length;
  const [bg, fg] = COLORS[idx];
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.35, flexShrink: 0 }}>
      {initials}
    </div>
  );
}

/* ── Badge ── */
export function Badge({ children, color = 'gray' }) {
  const colors = {
    green:  ['#dcfce7', '#166534'],
    orange: ['var(--orange-light)', 'var(--orange)'],
    teal:   ['var(--teal-light)', 'var(--teal)'],
    gray:   ['var(--gray-100)', 'var(--gray-600)'],
    amber:  ['#fef9c3', '#92400e'],
    red:    ['#fee2e2', '#b91c1c'],
  };
  const [bg, fg] = colors[color] || colors.gray;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, background: bg, color: fg }}>
      {children}
    </span>
  );
}

/* ── Stars ── */
export function Stars({ rating, count }) {
  if (!rating) return <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>No reviews yet</span>;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      {Array.from({ length: full }, (_, i) => <Star key={i} size={14} fill="var(--orange)" color="var(--orange)" />)}
      {half && <StarHalf size={14} fill="var(--orange)" color="var(--orange)" />}
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)', marginLeft: 2 }}>{rating}</span>
      {count !== undefined && <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>({count})</span>}
    </span>
  );
}

/* ── Toast ── */
let _setToast;
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  _setToast = setToast;
  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3500); return () => clearTimeout(t); }
  }, [toast]);
  return (
    <>
      {children}
      {toast && (
        <div className="animate-slideDown" style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: toast.type === 'error' ? '#b91c1c' : 'var(--gray-800)',
          color: '#fff', padding: '12px 20px', borderRadius: 'var(--radius-md)',
          fontSize: 14, fontWeight: 500, zIndex: 9999,
          boxShadow: 'var(--shadow-lg)', whiteSpace: 'nowrap',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>{toast.type === 'error' ? '✕' : '✓'}</span>
          {toast.message}
        </div>
      )}
    </>
  );
}
export function toast(message, type = 'success') { _setToast?.({ message, type }); }

/* ── Spinner ── */
export function Spinner() {
  return <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />;
}

/* ── Divider ── */
export function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
      {label && <span style={{ fontSize: 12, color: 'var(--gray-400)', fontWeight: 500 }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: 'var(--gray-200)' }} />
    </div>
  );
}

/* ── Stat Card ── */
export function StatCard({ label, value, icon: Icon, color = 'var(--orange)' }) {
  return (
    <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', padding: '16px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</p>
          <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--gray-800)' }}>{value}</p>
        </div>
        {Icon && <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={20} color={color} /></div>}
      </div>
    </div>
  );
}
