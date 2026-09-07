import type { ReactNode } from 'react';

interface LoginLayoutProps {
  children: ReactNode;
}

export function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-atlas-paper md:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-atlas-navy p-12 text-atlas-paper md:flex">
        <div className="flex items-center gap-2.5">
          <span className="block h-5.5 w-5.5 bg-atlas-accent" />
          <span className="font-condensed text-xl font-semibold tracking-[0.2em]">ATLAS</span>
        </div>
        <p className="m-0 max-w-75 text-[15px] leading-relaxed text-atlas-paper/65">
          Asset auditing for clients, stores and branches.
        </p>
      </aside>

      <main className="grid place-items-center p-6 md:p-10">
        <div className="w-full max-w-85">{children}</div>
      </main>
    </div>
  );
}
