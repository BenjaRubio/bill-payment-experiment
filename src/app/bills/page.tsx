import Link from 'next/link'

import { getBillsPageUser } from '@/app/_actions/user.action'

import BillCard from './_components/BillCard'

export default async function BillsPage() {
  const user = await getBillsPageUser()

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
          >
            ← Inicio
          </Link>
        </div>
        <section
          className="rounded-2xl border border-stone-400/25 px-6 py-8 sm:px-8"
          style={{ backgroundColor: 'var(--surface-raised)' }}
        >
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
            Mis cuentas
          </h1>
          <p className="mt-4 max-w-prose leading-relaxed text-[var(--muted-foreground)]">
            No hay una sesión iniciada. Para ver tus facturas, entra desde el inicio y crea o
            recupera un usuario de prueba.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Ir al inicio
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
        >
          ← Inicio
        </Link>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
          Mis cuentas
        </h1>
        <p className="mt-2 max-w-prose leading-relaxed text-[var(--muted-foreground)]">
          {user.name} — detalle de todas tus cuentas (pagadas y pendientes).
        </p>
      </div>

      {user.bills.length === 0 ? (
        <p className="text-sm text-[var(--muted)]">No tienes cuentas registradas.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {user.bills.map((bill) => (
            <li key={bill.id}>
              <BillCard bill={bill} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
