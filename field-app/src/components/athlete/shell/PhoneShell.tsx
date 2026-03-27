'use client';

export default function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center h-full min-h-screen bg-[var(--bg)]">
      <div
        className="w-full max-w-[390px] h-full min-h-screen flex flex-col relative overflow-hidden bg-[var(--bg)]"
      >
        {children}
      </div>
    </div>
  );
}
