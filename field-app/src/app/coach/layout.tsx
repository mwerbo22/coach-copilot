import SideNav from '@/components/coach/shell/SideNav';

export default function CoachLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="coach" className="flex h-screen overflow-hidden bg-[var(--bg)]">
      <SideNav />
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden min-w-0">
        {children}
      </main>
    </div>
  );
}
