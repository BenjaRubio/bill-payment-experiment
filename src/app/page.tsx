import Link from 'next/link'

import CreateTestUserButtons from './_components/CreateTestUserButtons'
import ExpiringBillBanner from './_components/ExpiringBillBanner'
import { getHomePageUser } from './_actions/user.action'

export default async function HomePage() {
  const currentUser = await getHomePageUser()

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      {currentUser ? <ExpiringBillBanner user={currentUser} /> : null}

      <section
        className="rounded-2xl border border-stone-400/25 px-6 py-8 sm:px-10 sm:py-10"
        style={{ backgroundColor: 'var(--surface-raised)' }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
          Pagos
        </p>
        <h1 className="mt-2 max-w-xl text-pretty text-2xl font-semibold leading-snug tracking-tight text-[var(--foreground)] sm:text-3xl">
          Bienvenido al sitio de pagos sencillos
        </h1>
        <p className="mt-4 max-w-prose leading-relaxed text-[var(--muted-foreground)]">
          Gestiona y paga tus cuentas desde un solo lugar, con un flujo claro y
          rápido.
        </p>
        {currentUser ? (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-stone-500/15 pt-8">
            <p className="text-base text-[var(--foreground)]">
              Hola,{' '}
              <span className="font-semibold text-[var(--accent)]">
                {currentUser.name}
              </span>
              .
            </p>
            <Link
              href="/bills"
              className="inline-flex items-center rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Ver mis cuentas
            </Link>
          </div>
        ) : null}
      </section>

      {!currentUser ? (
        <div className="mt-10">
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            Crea un usuario de prueba para comenzar (grupo control o variante).
          </p>
          <CreateTestUserButtons />
        </div>
      ) : null}
    </main>
  )
}
