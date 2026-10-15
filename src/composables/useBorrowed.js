import { ref, computed, watch } from 'vue'
import { todayStr, addDays, daysBetween } from '../utils/dates'

const KEY = 'borrowed-items'

function load() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

// Module-level state: every page that calls useBorrowed() shares the same list.
const items = ref(load())

// Auto-save to localStorage whenever anything changes (deep watch).
watch(items, (v) => localStorage.setItem(KEY, JSON.stringify(v)), { deep: true })

function validate(d) {
  if (!d.itemName?.trim() || !d.borrower?.trim() || !d.dateBorrowed || !d.dueDate) {
    return 'Item, borrower, date borrowed and due date are required.'
  }
  if (d.dueDate < d.dateBorrowed) return 'Due date cannot be earlier than the date borrowed.'
  return ''
}

function clean(d) {
  return {
    itemName: d.itemName.trim(),
    category: d.category,
    borrower: d.borrower.trim(),
    contact: d.contact?.trim() ?? '',
    dateBorrowed: d.dateBorrowed,
    dueDate: d.dueDate,
    notes: d.notes?.trim() ?? '',
  }
}

// Helpers used by several components
export const isOverdue = (item) => !item.returnedDate && item.dueDate < todayStr()
export const daysLeft = (item) => daysBetween(todayStr(), item.dueDate)

export function useBorrowed() {
  // CREATE
  function addItem(data) {
    const error = validate(data)
    if (error) return { ok: false, error }
    items.value.unshift({ id: Date.now(), ...clean(data), returnedDate: null })
    return { ok: true }
  }

  // UPDATE (edit the details)
  function updateItem(id, data) {
    const error = validate(data)
    if (error) return { ok: false, error }
    const item = items.value.find((i) => i.id === id)
    if (!item) return { ok: false, error: 'Item not found.' }
    Object.assign(item, clean(data))
    return { ok: true }
  }

  // UPDATE (status)
  function markReturned(id) {
    const item = items.value.find((i) => i.id === id)
    if (item) item.returnedDate = todayStr()
  }
  function markBorrowed(id) {
    const item = items.value.find((i) => i.id === id)
    if (item) item.returnedDate = null
  }

  // DELETE
  function deleteItem(id) {
    items.value = items.value.filter((i) => i.id !== id)
  }

  // Dashboard numbers (computed = recalculated automatically)
  const total = computed(() => items.value.length)
  const borrowedCount = computed(() => items.value.filter((i) => !i.returnedDate).length)
  const returnedCount = computed(() => items.value.filter((i) => i.returnedDate).length)
  const overdueCount = computed(() => items.value.filter(isOverdue).length)
  const dueSoon = computed(() =>
    items.value
      .filter((i) => !i.returnedDate)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5)
  )

  function loadSamples() {
    const samples = [
      ['Calculus textbook', 'Book', 'Maria Santos', -10, -3, false],
      ['Scientific calculator', 'School Supply', 'Juan Dela Cruz', -2, 2, false],
      ['Power bank', 'Gadget', 'Carlo Mendoza', -1, 7, false],
      ['Hammer', 'Tool', 'Mang Tonyo', -4, 1, false],
      ['Umbrella', 'Other', 'Ana Reyes', -8, -5, true],
    ]
    samples.forEach(([itemName, category, borrower, b, d, returned], i) => {
      items.value.push({
        id: Date.now() + i,
        itemName, category, borrower,
        contact: '', notes: '',
        dateBorrowed: addDays(b),
        dueDate: addDays(d),
        returnedDate: returned ? addDays(-5) : null,
      })
    })
  }

  return {
    items, addItem, updateItem, markReturned, markBorrowed, deleteItem, loadSamples,
    total, borrowedCount, returnedCount, overdueCount, dueSoon,
  }
}