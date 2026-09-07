import { useEffect, useRef, useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import useLogout from '@/hooks/useLogout';

interface AppLayoutProps {
  title: string;
  children: ReactNode;
}

const NAV_LINK_BASE =
  'inline-flex items-center border-b-2 px-1 font-sans text-sm whitespace-nowrap transition-colors';
const NAV_LINK_ACTIVE = 'border-atlas-blue text-atlas-ink';
const NAV_LINK_INACTIVE = 'border-transparent text-atlas-ink/60 hover:text-atlas-ink';

export function AppLayout({ title, children }: AppLayoutProps) {
  const logout = useLogout();
  const [assetsMenuOpen, setAssetsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAssetsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-atlas-paper">
      <header className="sticky top-0 z-20 flex h-[58px] flex-none items-stretch gap-8 border-b border-atlas-ink/14 bg-atlas-paper px-7">
        <div className="flex flex-none items-center gap-2.5">
          <span className="block h-[18px] w-[18px] bg-atlas-blue" />
          <span className="font-condensed text-[19px] font-semibold tracking-[0.2em]">ATLAS</span>
        </div>

        <nav className="flex min-w-0 flex-1 items-stretch gap-1">
          <NavLink
            to="dashboard"
            end
            className={({ isActive }) => `${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`}
          >
            Dashboard
          </NavLink>

          <div ref={menuRef} className="relative ml-6 flex items-stretch">
            <NavLink
              to="assets"
              onClick={(event) => {
                event.preventDefault();
                setAssetsMenuOpen((open) => !open);
              }}
              className={({ isActive }) => `${NAV_LINK_BASE} cursor-pointer gap-2 ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`}
            >
              Asset Management
              <span
                className="text-[9px] leading-none opacity-70 transition-transform duration-150"
                style={{ transform: `rotate(${assetsMenuOpen ? 90 : 0}deg)` }}
              >
                ▶
              </span>
            </NavLink>

            {assetsMenuOpen && (
              <div className="absolute top-full left-0 flex min-w-[210px] flex-col border border-atlas-ink/18 bg-atlas-paper p-1">
                <NavLink
                  to="assets/assignment"
                  onClick={() => setAssetsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-9 items-center px-3 text-[13.5px] hover:bg-atlas-blue/14 ${isActive ? 'bg-atlas-blue/14' : ''}`
                  }
                >
                  Asset Assignment
                </NavLink>
                <NavLink
                  to="assets"
                  end
                  onClick={() => setAssetsMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex min-h-9 items-center px-3 text-[13.5px] hover:bg-atlas-blue/14 ${isActive ? 'bg-atlas-blue/14' : ''}`
                  }
                >
                  Assets
                </NavLink>
              </div>
            )}
          </div>
        </nav>

        <div className="flex flex-none items-center gap-4">
          <button
            type="button"
            onClick={() => logout()}
            className="cursor-pointer border-0 bg-transparent font-condensed text-[12.5px] font-semibold tracking-[0.08em] text-atlas-blue-text uppercase hover:text-atlas-navy"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-[22px] p-7">
        <h1 className="m-0 font-condensed text-[26px] font-semibold">{title}</h1>
        {children}
      </main>
    </div>
  );
}
