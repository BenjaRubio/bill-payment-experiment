import { ExperimentGroup, TrackingEventEnum } from '@/database/generated/enums'

import { payBill } from '@/app/_actions/bill.action'
import { trackEvent } from '@/services/tracking-events.service'

type Props = {
  user: {
    id: number
    experimentGroup: (typeof ExperimentGroup)[keyof typeof ExperimentGroup]
    bills: Array<{ id: number; expirationDate: Date; amount: number }>
  }
}

export default async function ExpiringBillBanner({ user }: Props) {
  if (user.experimentGroup !== ExperimentGroup.VARIANT) {
    return null
  }

  const urgentBill = user.bills[0]
  if (!urgentBill) {
    return null
  }

  await trackEvent(TrackingEventEnum.BANNER_VIEWED, user.id)

  return (
    <div
      role="alert"
      className="mb-6 rounded-xl border border-amber-900/15 bg-amber-200/35 px-4 py-4 text-[var(--foreground)]"
    >
      <p className="font-semibold text-amber-950">Tu cuenta está por vencer</p>
      <p className="mt-2 text-sm leading-relaxed text-stone-800">
        Tienes la cuenta #{urgentBill.id} sin pagar por ${urgentBill.amount}; vencimiento{' '}
        {urgentBill.expirationDate.toLocaleDateString('es-CL')}. Te recomendamos pagarla
        cuanto antes.
      </p>
      <form className="mt-4" action={payBill.bind(null, urgentBill.id)}>
        <button
          type="submit"
          className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
        >
          Pagar
        </button>
      </form>
    </div>
  )
}
