import { useEffect, useRef, useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import useLogout from '@/hooks/useLogout';
import type { UserType } from '@/common/types/common';

interface AppLayoutProps {
  title: string;
  userType: UserType | null;
  children: ReactNode;
}

interface NavSubItem {
  label: string;
  path: string;
  end?: boolean;
}

interface NavModule {
  label: string;
  path: string;
  allow: UserType[];
  submenu?: NavSubItem[];
}

const NAV_LINK_BASE =
  'inline-flex items-center border-b-2 px-1 font-sans text-sm whitespace-nowrap transition-colors';
const NAV_LINK_ACTIVE = 'border-atlas-blue text-atlas-ink';
const NAV_LINK_INACTIVE = 'border-transparent text-atlas-ink/60 hover:text-atlas-ink';

// The Phase 2.1 module tree (docs/development-phases.md §"Module tree
// (decided in 2.1)") and its RBAC mapping (§"RBAC mapping (2.1 decision)"),
// in one place so adding a module means adding a config entry, not
// copy-pasting the dropdown markup again.
const NAV_MODULES: NavModule[] = [
  {
    label: 'User Management',
    path: 'users',
    allow: ['admin'],
  },
  {
    label: 'Client Management',
    path: 'clients',
    allow: ['admin'],
    submenu: [
      { label: 'All Clients', path: 'clients', end: true },
      { label: 'All Stores', path: 'clients/stores' },
      { label: 'All Branches', path: 'clients/branches' },
    ],
  },
  {
    label: 'Asset Management',
    path: 'assets',
    allow: ['admin'],
    submenu: [
      { label: 'Assets', path: 'assets', end: true },
      { label: 'Asset Assignment', path: 'assets/assignment' },
    ],
  },
  {
    label: 'Audit Management',
    path: 'audit',
    allow: ['admin', 'auditor'],
    submenu: [
      { label: 'Audit Requests', path: 'audit/requests' },
      { label: 'Field Audits', path: 'audit/field-audits' },
      { label: 'Findings Review', path: 'audit/findings' },
      { label: 'Tickets', path: 'audit/tickets' },
    ],
  },
  {
    label: 'My Stores & Branches',
    path: 'stores',
    allow: ['client'],
    submenu: [
      { label: 'My Stores', path: 'stores', end: true },
      { label: 'My Branches', path: 'branches' },
    ],
  },
];

export function AppLayout({ title, userType, children }: AppLayoutProps) {
  const logout = useLogout();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const visibleModules = NAV_MODULES.filter((module) => userType && module.allow.includes(userType));

  return (
    <div className="flex min-h-screen flex-col bg-atlas-paper">
      <header className="sticky top-0 z-20 flex h-[58px] flex-none items-stretch gap-8 border-b border-atlas-ink/14 bg-atlas-paper px-7">
        <div className="flex flex-none items-center gap-2.5">
          <span className="block h-[18px] w-[18px] bg-atlas-blue" />
          <span className="font-condensed text-[19px] font-semibold tracking-[0.2em]">ATLAS</span>
        </div>

        <nav ref={navRef} className="flex min-w-0 flex-1 items-stretch gap-1">
          <NavLink
            to="dashboard"
            end
            className={({ isActive }) => `${NAV_LINK_BASE} ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`}
          >
            Dashboard
          </NavLink>

          {visibleModules.map((module) =>
            module.submenu ? (
              <div key={module.path} className="relative ml-6 flex items-stretch">
                <NavLink
                  to={module.path}
                  onClick={(event) => {
                    event.preventDefault();
                    setOpenMenu((current) => (current === module.path ? null : module.path));
                  }}
                  className={({ isActive }) =>
                    `${NAV_LINK_BASE} cursor-pointer gap-2 ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`
                  }
                >
                  {module.label}
                  <span
                    className="text-[9px] leading-none opacity-70 transition-transform duration-150"
                    style={{ transform: `rotate(${openMenu === module.path ? 90 : 0}deg)` }}
                  >
                    ▶
                  </span>
                </NavLink>

                {openMenu === module.path && (
                  <div className="absolute top-full left-0 flex min-w-[210px] flex-col border border-atlas-ink/18 bg-atlas-paper p-1">
                    {module.submenu.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.end}
                        onClick={() => setOpenMenu(null)}
                        className={({ isActive }) =>
                          `flex min-h-9 items-center px-3 text-[13.5px] hover:bg-atlas-blue/14 ${isActive ? 'bg-atlas-blue/14' : ''}`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={module.path}
                to={module.path}
                className={({ isActive }) =>
                  `${NAV_LINK_BASE} ml-6 ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE}`
                }
              >
                {module.label}
              </NavLink>
            )
          )}
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
