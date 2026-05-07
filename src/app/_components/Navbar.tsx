import Link from 'next/link'
import { cookies } from 'next/headers'

import { logout } from '@/app/_actions/auth'

const navLinkClass =
  'rounded-md px-3 py-2 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-black/[0.06] hover:text-[var(--foreground)]'

export default async function Navbar() {
  const hasSession = !!(await cookies()).get('user_id')?.value

  return (
    <header
      className="border-b border-[var(--nav-border)]"
      style={{ backgroundColor: 'var(--nav-surface)' }}
    >
      <nav
        className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8"
        aria-label="Principal"
      >
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link href="/" className={navLinkClass}>
            Inicio
          </Link>
          <Link href="/bills" className={navLinkClass}>
            Cuentas
          </Link>
          <Link href="/dashboard" className={navLinkClass}>
            Dashboard
          </Link>
        </div>
        {hasSession ? (
          <form action={logout}>
            <button
              type="submit"
              className="rounded-md bg-black/[0.08] px-3 py-2 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-black/[0.12]"
            >
              Cerrar sesión
            </button>
          </form>
        ) : null}
      </nav>
    </header>
  )
}
