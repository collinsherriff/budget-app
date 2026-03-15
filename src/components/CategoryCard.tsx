import { useState } from 'react'
import { CategoryWithItems, BudgetItem } from '../types'
import ItemRow from './ItemRow'

interface Props {
  category: CategoryWithItems
  onUpdateItem: (item: BudgetItem, newAmount: number) => Promise<{ error: unknown }>
}

function fmt(n: number) {
  return '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

const typeColors: Record<string, string> = {
  income: 'text-emerald-600',
  savings: 'text-blue-600',
  expense: 'text-gray-900',
}

export default function CategoryCard({ category, onUpdateItem }: Props) {
  const [open, setOpen] = useState(false)

  const hasItems = category.items.length > 0

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3.5 text-left"
        onClick={() => hasItems && setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{category.icon}</span>
          <span className="font-medium text-gray-900 text-sm">{category.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-sm ${typeColors[category.type]}`}>
            {fmt(category.total)}
          </span>
          {hasItems && (
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </button>

      {open && hasItems && (
        <div className="border-t border-gray-50">
          {category.items.map((item, i) => (
            <ItemRow
              key={item.id}
              item={item}
              last={i === category.items.length - 1}
              onUpdate={onUpdateItem}
            />
          ))}
        </div>
      )}
    </div>
  )
}
