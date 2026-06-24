import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTenant, TENANTS } from '../tenant/tenant.context';
import { useSession } from '../session/session.context';

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    'no-underline font-semibold px-2.5 py-1.5 rounded-lg',
    isActive ? 'bg-brand-surface-muted text-brand-primary' : 'text-brand-text',
  ].join(' ');

export function AppLayout() {
  const { tenant, setBrandId } = useTenant();
  const { user, signOut } = useSession();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/auth/login');
  };

  return (
    <div className="max-w-[880px] mx-auto px-5 py-6">
      <header className="flex items-center gap-4 flex-wrap pb-4 border-b border-brand-border">
        <nav aria-label="Primary" className="flex gap-1">
          <NavLink to="/" end className={navClass}>
            Home
          </NavLink>
          <NavLink to="/auth/login" className={navClass}>
            Login
          </NavLink>
          <NavLink to="/account/billing" className={navClass}>
            Billing
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <label htmlFor="tenant-switcher" className="m-0 text-[13px]">
              Brand
            </label>
            <div className="relative">
              <select
                id="tenant-switcher"
                value={tenant.brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-auto pl-3 pr-9 py-2.5 cursor-pointer"
              >
                {Object.values(TENANTS).map((t) => (
                  <option key={t.brandId} value={t.brandId}>
                    {t.name}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand-text-muted"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          {user && (
            <button
              type="button"
              onClick={handleSignOut}
              className="font-semibold text-brand-primary underline bg-transparent border-0 cursor-pointer p-0 text-[13px]"
            >
              Sign out
            </button>
          )}
        </div>
      </header>

      <main className="mt-6">
        <Outlet />
      </main>
    </div>
  );
}
