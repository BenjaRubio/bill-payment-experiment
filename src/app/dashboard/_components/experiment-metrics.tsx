import type {
  ExperimentDashboardData,
  GroupExperimentMetrics,
} from '@/services/experiment-metrics.service'

function formatPctFraction(rate: number) {
  if (!Number.isFinite(rate)) return '—'
  return `${(Math.round(rate * 10000) / 100).toLocaleString('es-CL', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}`
}

function RateRow({ converted, denominator }: { converted: number; denominator: number }) {
  if (denominator === 0) {
    return <span className="text-[var(--muted)]">Sin usuarios evaluables aún.</span>
  }
  const rate = converted / denominator
  const failed = denominator - converted
  return (
    <span className="font-semibold tabular-nums">
      {converted} / {denominator}{' '}
      <span className="font-normal text-[var(--muted)]">
        ({formatPctFraction(rate)}%)
      </span>
    </span>
  )
}

function GroupKpi({
  title,
  m,
}: {
  title: string
  m: GroupExperimentMetrics
}) {
  const notEvaluable = Math.max(m.totalUsers - m.eligibleUsers, 0)

  return (
    <div
      className="rounded-xl border border-stone-400/25 p-5"
      style={{ backgroundColor: 'var(--surface-raised)' }}
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{title}</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-[var(--muted)]">Usuarios en el grupo</dt>
          <dd className="text-2xl font-semibold tabular-nums text-[var(--foreground)]">{m.totalUsers}</dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">
            Pago a tiempo
          </dt>
          <dd className="mt-1">
            <RateRow converted={m.convertedUsers} denominator={m.eligibleUsers} />
          </dd>
        </div>
      </dl>
    </div>
  )
}

function FunnelBar({
  label,
  subtitle,
  count,
  overTotal,
}: {
  label: string
  subtitle?: string
  count: number
  overTotal: number
}) {
  const pct = overTotal > 0 ? (count / overTotal) * 100 : 0

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-2 text-sm">
        <div>
          <span className="font-medium text-[var(--foreground)]">{label}</span>
          {subtitle ? (
            <p className="text-xs text-[var(--muted)]">{subtitle}</p>
          ) : null}
        </div>
        <span className="tabular-nums text-[var(--muted-foreground)]">
          {count}{' '}
          <span className="text-[var(--muted)]">
            ({formatPctFraction(pct / 100)}%)
          </span>
        </span>
      </div>
      <div className="mt-2 h-2.5 w-full rounded-full bg-stone-700/15">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300"
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  )
}

export function ExperimentMetricsSection({ data }: { data: ExperimentDashboardData }) {
  const { control, variant, variantBannerViewed, variantFunnelConvertedWithBanner } = data

  return (
    <section className="mt-10 space-y-10">
      <div>
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <GroupKpi title="Control" m={control} />
          <GroupKpi title="Variante" m={variant} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Funnels de conversión</h2>
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-[var(--muted-foreground)]">
          Cada barra muestra cuántos usuarios representa la etapa.
        </p>

        <div className="mt-8 space-y-10">
          <div
            className="space-y-5 rounded-xl border border-stone-400/25 p-6"
            style={{ backgroundColor: 'var(--surface-raised)' }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
              Control
            </h3>
            {control.totalUsers === 0 ? (
              <p className="text-sm text-[var(--muted)]">No hay usuarios en grupo control.</p>
            ) : (
              <>
                <FunnelBar
                  label="Total usuarios del grupo"
                  count={control.totalUsers}
                  overTotal={control.totalUsers}
                />
                <FunnelBar
                  label="Pagaron a tiempo"
                  count={control.convertedUsers}
                  overTotal={control.totalUsers}
                />
              </>
            )}
          </div>

          <div
            className="space-y-5 rounded-xl border border-stone-400/25 p-6"
            style={{ backgroundColor: 'var(--surface-raised)' }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--muted)]">
              Variante
            </h3>
            {variant.totalUsers === 0 ? (
              <p className="text-sm text-[var(--muted)]">No hay usuarios en grupo variante.</p>
            ) : (
              <>
                <FunnelBar
                  label="Total usuarios del grupo"
                  count={variant.totalUsers}
                  overTotal={variant.totalUsers}
                />
                <FunnelBar
                  label="Vieron el banner"
                  subtitle="Tracking event banner_viewed (solo cuentas variante)."
                  count={variantBannerViewed}
                  overTotal={variant.totalUsers}
                />
                <FunnelBar
                  label="Pagaron a tiempo después de ver el banner"
                  count={variantFunnelConvertedWithBanner}
                  overTotal={variant.totalUsers}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
