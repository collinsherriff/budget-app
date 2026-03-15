export type CategoryType = 'income' | 'savings' | 'expense'

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  type: CategoryType
  sort_order: number
}

export interface BudgetItem {
  id: string
  user_id: string
  category_id: string
  name: string
  amount: number
  sort_order: number
}

export interface CategoryWithItems extends Category {
  items: BudgetItem[]
  total: number
}
