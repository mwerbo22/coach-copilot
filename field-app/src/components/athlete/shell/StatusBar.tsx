export default function StatusBar() {
  return (
    <div className="h-11 flex items-center justify-between px-6 shrink-0">
      <span className="text-[11px] font-semibold text-[var(--text)] font-[var(--ffm)]">9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor" className="text-[var(--text)]">
          <rect x="0"  y="7" width="3" height="5" rx="0.5" />
          <rect x="4.5" y="4.5" width="3" height="7.5" rx="0.5" />
          <rect x="9"  y="2"  width="3" height="10" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.3" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-[var(--text)]">
          <path d="M1 4.5C3.7 1.8 7.2 0 8 0s4.3 1.8 7 4.5" opacity="0.3"/>
          <path d="M3 7C4.7 5.3 6.2 4.5 8 4.5S11.3 5.3 13 7"/>
          <path d="M5.5 9.5C6.4 8.6 7.1 8 8 8s1.6.6 2.5 1.5"/>
          <circle cx="8" cy="11.5" r="0.7" fill="currentColor" stroke="none"/>
        </svg>
        {/* Battery */}
        <div className="flex items-center">
          <div className="w-6 h-3 rounded-[3px] border border-[var(--text)] relative">
            <div className="absolute inset-[2px] right-[2px] bg-[var(--text)] rounded-[1px]" style={{ width: '80%' }} />
          </div>
          <div className="w-[2px] h-[5px] bg-[var(--text)] rounded-r-[1px] opacity-40" />
        </div>
      </div>
    </div>
  );
}
