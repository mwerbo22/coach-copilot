import PhoneShell from '@/components/athlete/shell/PhoneShell';
import StatusBar from '@/components/athlete/shell/StatusBar';
import BottomNav from '@/components/athlete/shell/BottomNav';

export default function AthleteLayout({ children }: { children: React.ReactNode }) {
  return (
    <PhoneShell>
      <StatusBar />
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
      <BottomNav />
    </PhoneShell>
  );
}
