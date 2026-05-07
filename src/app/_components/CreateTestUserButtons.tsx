'use client'

import { useTransition } from 'react'
import { ExperimentGroup } from '@/database/generated/enums'
import { createTestUser } from '@/app/_actions/user.action'

export default function CreateTestUserButtons() {
  const [pending, startTransition] = useTransition()

  function handleCreate(group: (typeof ExperimentGroup)[keyof typeof ExperimentGroup]) {
    startTransition(() => {
      void createTestUser(group)
    })
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        disabled={pending}
        onClick={() => handleCreate(ExperimentGroup.CONTROL)}
        className="rounded-lg border border-stone-600/35 bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-black/[0.06] disabled:opacity-45"
      >
        Crear usuario grupo de control
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => handleCreate(ExperimentGroup.VARIANT)}
        className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-45"
      >
        Crear usuario grupo variante
      </button>
    </div>
  )
}
