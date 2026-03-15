import { useBudget } from '../hooks/useBudget'
import { useAuth } from '../hooks/useAuth'
import SummaryBar from './SummaryBar'
import CategoryCard from './CategoryCard'

interface Props {
  userId: string
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Dashboard({ userId }: Props) {
  const { categories, loading, error, updateItemAmount } = useBudget(userId)
  const { signOut } = useAuth()

  const now = new Date()
  const monthLabel = `${MONTHS[now.getMonth()]} ${now.getFullYear()}`

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl">{error}</div>
      </div>
    )
  }

  const incomeCategories = categories.filter(c => c.type === 'income')
  const savingsCategories = categories.filter(c => c.type === 'savings')
  const expenseCategories = categories.filter(c => c.type === 'expense')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4 max-w-lg mx-auto">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Budget</h1>
            <p className="text-xs text-gray-400">{monthLabel}</p>
          </div>
          <button
            onClick={signOut}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Summary */}
        <div className="pt-4">
          <SummaryBar categories={categories} />
        </div>

        {/* Categories */}
        <div className="px-4 pb-8 space-y-6">

          {/* Income */}
          {incomeCategories.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Income</h2>
              <div className="space-y-2">
                {incomeCategories.map(cat => (
                  <CategoryCard key={cat.id} category={cat} onUpdateItem={updateItemAmount} />
                ))}
              </div>
            </section>
          )}

          {/* Savings */}
          {savingsCategories.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Savings</h2>
              <div className="space-y-2">
                {savingsCategories.map(cat => (
                  <CategoryCard key={cat.id} category={cat} onUpdateItem={updateItemAmount} />
                ))}
              </div>
            </section>
          )}

          {/* Expenses */}
          {expenseCategories.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">Expenses</h2>
              <div className="space-y-2">
                {expenseCategories.map(cat => (
                  <CategoryCard key={cat.id} category={cat} onUpdateItem={updateItemAmount} />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </div>
  )
}
