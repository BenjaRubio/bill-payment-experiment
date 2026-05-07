import { ExperimentMetricsSection } from './_components/experiment-metrics'
import { getExperimentDashboardData } from '@/services/experiment-metrics.service'

export default async function DashboardPage() {
  const metrics = await getExperimentDashboardData()

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">Dashboard</h1>

      <ExperimentMetricsSection data={metrics} />

    </main>
  )
}
