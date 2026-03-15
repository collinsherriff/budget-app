import { CategoryWithItems } from '../types'

interface Props {
  categories: CategoryWithItems[]
}

function fmt(n: number) {
  return '£' + n.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

export default function SummaryBar({ categories }: Props) {
  const income = categories.filter(c => c.type === 'income').reduce((s, c) => s + c.total, 0)
  const savings = categories.filter(c => c.type === 'savings').reduce((s, c) => s + c.total, 0)
  const expenses = categories.filter(c => c.type === 'expense').reduce((s, c) => s + c.total, 0)
  const balance = income - savings - expenses

  const cards = [
    { label: 'Income', value: income, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Savings', value: savings, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Expenses', value: expenses, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Balance', value: balance, color: balance >= 0 ? 'text-gray-900' : 'text-red-500', bg: 'bg-white' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 px-4 pb-4">
      {cards.map(card => (
        <div key={card.label} className={`${card.bg} rounded-2xl p-4 border border-gray-100`}>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{card.label}</p>
          <p className={`text-xl font-bold ${card.color}`}>{fmt(card.value)}</p>
        </div>
      ))}
    </div>
  )
}
