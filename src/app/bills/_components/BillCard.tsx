import { payBill } from '@/app/_actions/bill.action'

export type BillCardModel = {
  id: number
  emissionDate: Date
  expirationDate: Date
  amount: number
  paidAt: Date | null
}

export default function BillCard({ bill }: { bill: BillCardModel }) {
  const paid = bill.paidAt != null

  return (
    <article
      className="rounded-xl border border-stone-400/25 p-5"
      style={{ backgroundColor: 'var(--surface-raised)' }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-sm text-[var(--muted)]">Cuenta #{bill.id}</p>
          <p className="mt-1 text-lg font-semibold text-[var(--foreground)]">
            {new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP',
              maximumFractionDigits: 0,
            }).format(bill.amount)}
          </p>
        </div>
        <span
          className={
            paid
              ? 'rounded-full bg-[var(--accent)]/15 px-3 py-1 text-sm font-medium text-[var(--accent)]'
              : 'rounded-full bg-amber-900/12 px-3 py-1 text-sm font-medium text-amber-950'
          }
        >
          {paid ? 'Pagada' : 'Pendiente de pago'}
        </span>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-[var(--muted-foreground)] sm:grid-cols-2">
        <div>
          <dt className="text-[var(--muted)]">Emisión</dt>
          <dd>{bill.emissionDate.toLocaleDateString('es-CL')}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Vencimiento</dt>
          <dd>{bill.expirationDate.toLocaleDateString('es-CL')}</dd>
        </div>
        {paid && bill.paidAt ? (
          <div className="sm:col-span-2">
            <dt className="text-[var(--muted)]">Fecha de pago</dt>
            <dd>{bill.paidAt.toLocaleDateString('es-CL')}</dd>
          </div>
        ) : null}
      </dl>
      {!paid ? (
        <form className="mt-4" action={payBill.bind(null, bill.id)}>
          <button
            type="submit"
            className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Pagar
          </button>
        </form>
      ) : null}
    </article>
  )
}
