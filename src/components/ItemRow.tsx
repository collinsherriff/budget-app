import { useState } from 'react'
import { BudgetItem } from '../types'

interface Props {
  item: BudgetItem
  last: boolean
  onUpdate: (item: BudgetItem, newAmount: number) => Promise<{ error: unknown }>
}

export default function ItemRow({ item, last, onUpdate }: Props) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(item.amount))
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    const num = parseFloat(value)
    if (isNaN(num) || num < 0) { setEditing(false); setValue(String(item.amount)); return }
    setSaving(true)
    await onUpdate(item, num)
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className={`flex items-center justify-between px-4 py-3 ${!last ? 'border-b border-gray-50' : ''}`}>
      <span className="text-sm text-gray-600">{item.name}</span>

      {editing ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">£</span>
          <input
            autoFocus
            type="number"
            min="0"
            step="0.01"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') { setEditing(false); setValue(String(item.amount)) } }}
            className="w-24 text-right text-sm border border-blue-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs bg-gray-900 text-white px-2.5 py-1 rounded-lg disabled:opacity-50"
          >
            {saving ? '...' : 'Save'}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
        >
          £{Number(item.amount).toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </button>
      )}
    </div>
  )
}
