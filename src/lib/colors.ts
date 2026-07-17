// Fixed preset palette for task types, kept as literal Tailwind class
// strings (not built with template interpolation) so Tailwind's build-time
// scanner can find and emit them.
export const TASK_COLORS = [
  'rose',
  'orange',
  'amber',
  'emerald',
  'teal',
  'sky',
  'indigo',
  'violet',
] as const

export type TaskColor = (typeof TASK_COLORS)[number]

interface TaskColorClasses {
  dot: string
  chipBg: string
  chipText: string
  chipBgSelected: string
  ring: string
}

export const TASK_COLOR_CLASSES: Record<TaskColor, TaskColorClasses> = {
  rose: {
    dot: 'bg-rose-500',
    chipBg: 'bg-rose-100',
    chipText: 'text-rose-700',
    chipBgSelected: 'bg-rose-500',
    ring: 'ring-rose-500',
  },
  orange: {
    dot: 'bg-orange-500',
    chipBg: 'bg-orange-100',
    chipText: 'text-orange-700',
    chipBgSelected: 'bg-orange-500',
    ring: 'ring-orange-500',
  },
  amber: {
    dot: 'bg-amber-500',
    chipBg: 'bg-amber-100',
    chipText: 'text-amber-700',
    chipBgSelected: 'bg-amber-500',
    ring: 'ring-amber-500',
  },
  emerald: {
    dot: 'bg-emerald-500',
    chipBg: 'bg-emerald-100',
    chipText: 'text-emerald-700',
    chipBgSelected: 'bg-emerald-500',
    ring: 'ring-emerald-500',
  },
  teal: {
    dot: 'bg-teal-500',
    chipBg: 'bg-teal-100',
    chipText: 'text-teal-700',
    chipBgSelected: 'bg-teal-500',
    ring: 'ring-teal-500',
  },
  sky: {
    dot: 'bg-sky-500',
    chipBg: 'bg-sky-100',
    chipText: 'text-sky-700',
    chipBgSelected: 'bg-sky-500',
    ring: 'ring-sky-500',
  },
  indigo: {
    dot: 'bg-indigo-500',
    chipBg: 'bg-indigo-100',
    chipText: 'text-indigo-700',
    chipBgSelected: 'bg-indigo-500',
    ring: 'ring-indigo-500',
  },
  violet: {
    dot: 'bg-violet-500',
    chipBg: 'bg-violet-100',
    chipText: 'text-violet-700',
    chipBgSelected: 'bg-violet-500',
    ring: 'ring-violet-500',
  },
}

export function isTaskColor(value: string): value is TaskColor {
  return (TASK_COLORS as readonly string[]).includes(value)
}
