import { redirect } from 'next/navigation'

import Link from 'next/link'

import { getBillsPageUser } from '@/app/_actions/user.action'

export default async function DashboardPage() {
  const user = await getBillsPageUser()

  if (!user) {
    redirect('/')
  }

  const pending = user.bills.filter((b) => b.paidAt == null).length
  const paid = user.bills.length - pending

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Dashboard</h1>
      <p className="mt-2 text-[var(--muted-foreground)]">
        Sesión iniciada como{' '}
        <span className="font-semibold text-[var(--accent)]">{user.name}</span>.
      </p>
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div
          className="rounded-xl border border-stone-400/25 p-5"
          style={{ backgroundColor: 'var(--surface-raised)' }}
        >
          <dt className="text-sm text-[var(--muted)]">Facturas pendientes</dt>
          <dd className="mt-1 text-3xl font-semibold tabular-nums text-amber-900/90">{pending}</dd>
        </div>
        <div
          className="rounded-xl border border-stone-400/25 p-5"
          style={{ backgroundColor: 'var(--surface-raised)' }}
        >
          <dt className="text-sm text-[var(--muted)]">Facturas pagadas</dt>
          <dd className="mt-1 text-3xl font-semibold tabular-nums text-[var(--accent)]">{paid}</dd>
        </div>
      </dl>
      <p className="mt-6 text-sm text-[var(--muted)]">
        Gestiona el detalle de cada cuenta en{' '}
        <Link
          href="/bills"
          className="font-medium text-[var(--foreground)] underline decoration-stone-400/70 underline-offset-2 hover:decoration-[var(--accent)]"
        >
          Cuentas
        </Link>
        .
      </p>
    </main>
  )
}
