'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    href: '/athlete',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    id: 'workout',
    label: 'Workout',
    href: '/athlete/workout',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <path d="M6.5 6.5h11M6.5 17.5h11M3 10h3M18 10h3M3 14h3M18 14h3"/>
      </svg>
    ),
  },
  {
    id: 'log',
    label: 'Log',
    href: '/athlete/log',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    id: 'progress',
    label: 'Progress',
    href: '/athlete/progress',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[22px] h-[22px]">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="shrink-0 flex items-center bg-[var(--s1)] border-t border-[var(--border)]"
      style={{ height: 'var(--nav-h)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === '/athlete'
          ? pathname === '/athlete'
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 relative transition-colors ${
              isActive ? 'text-[var(--lime)]' : 'text-[var(--text3)]'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-semibold tracking-wide uppercase">{item.label}</span>
            {isActive && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--lime)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
