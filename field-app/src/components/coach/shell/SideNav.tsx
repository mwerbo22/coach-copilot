'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    href: '/coach',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, flexShrink: 0 }}>
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    href: '/coach/roster',
    label: 'Roster',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, flexShrink: 0 }}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    href: '/coach/programs',
    label: 'Program Builder',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 15, height: 15, flexShrink: 0 }}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        width: 'var(--nav-w)',
        background: 'var(--s1)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '18px 20px 14px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{
          width: 30, height: 30,
          background: 'var(--lime)',
          borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--ffc)',
          fontSize: 13,
          fontWeight: 800,
          color: '#0f0f10',
          letterSpacing: '-0.5px',
          flexShrink: 0,
        }}>F</div>
        <div>
          <div style={{ fontFamily: 'var(--ffc)', fontSize: 15, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.3px' }}>Field</div>
          <div style={{ color: 'var(--text3)', fontWeight: 400, fontSize: 10, letterSpacing: '0.1em', fontFamily: 'var(--ffm)', textTransform: 'uppercase' }}>Coach Portal</div>
        </div>
      </div>

      {/* Section label */}
      <div style={{ fontFamily: 'var(--ffm)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text3)', padding: '14px 20px 6px' }}>
        Menu
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/coach'
            ? pathname === '/coach'
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '9px 20px',
                position: 'relative',
                transition: 'background 0.14s',
                color: isActive ? 'var(--lime)' : 'var(--text2)',
                background: isActive ? 'var(--lime-dim)' : 'transparent',
                fontSize: 13,
                fontFamily: 'var(--ff)',
                textDecoration: 'none',
              }}
              className={isActive ? 'nav-item-active' : 'nav-item-default'}
            >
              {isActive && (
                <span style={{
                  position: 'absolute', left: 0, top: 4, bottom: 4,
                  width: 2, background: 'var(--lime)', borderRadius: '0 2px 2px 0',
                }} />
              )}
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        {/* User */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px', borderRadius: 'var(--r)', cursor: 'pointer' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4fa3ff, #b78aff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: 'white',
            flexShrink: 0, fontFamily: 'var(--ffc)',
          }}>SC</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Sarah Chen</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--ffm)', letterSpacing: '0.05em' }}>Head Coach</div>
          </div>
        </div>
        {/* Athlete view link */}
        <Link
          href="/athlete"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            marginTop: 8, padding: '8px 12px',
            background: 'var(--lime-dim)',
            border: '1px solid rgba(200,245,62,0.2)',
            borderRadius: 'var(--r)',
            color: 'var(--lime)',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'var(--ff)',
            textDecoration: 'none',
            transition: 'all 0.15s',
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          Open Athlete View
        </Link>
      </div>
    </nav>
  );
}
