import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { CategoryWithItems, BudgetItem } from '../types'

export function useBudget(userId: string) {
  const [categories, setCategories] = useState<CategoryWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBudget = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data: cats, error: catsErr } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order')

    if (catsErr) { setError(catsErr.message); setLoading(false); return }

    const { data: items, error: itemsErr } = await supabase
      .from('budget_items')
      .select('*')
      .eq('user_id', userId)
      .order('sort_order')

    if (itemsErr) { setError(itemsErr.message); setLoading(false); return }

    const merged: CategoryWithItems[] = (cats ?? []).map(cat => {
      const catItems = (items ?? []).filter(i => i.category_id === cat.id)
      return {
        ...cat,
        items: catItems,
        total: catItems.reduce((sum, i) => sum + Number(i.amount), 0),
      }
    })

    setCategories(merged)
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchBudget() }, [fetchBudget])

  const updateItemAmount = async (item: BudgetItem, newAmount: number) => {
    const { error } = await supabase
      .from('budget_items')
      .update({ amount: newAmount })
      .eq('id', item.id)
      .eq('user_id', userId)

    if (!error) fetchBudget()
    return { error }
  }

  return { categories, loading, error, refetch: fetchBudget, updateItemAmount }
}
