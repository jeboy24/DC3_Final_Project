<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ItemForm from '../components/ItemForm.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useBorrowed, isOverdue } from '../composables/useBorrowed'
import { formatDate } from '../utils/dates'

const route = useRoute()
const router = useRouter()
const { items, addItem, updateItem, deleteItem, markReturned, markBorrowed } = useBorrowed()

const editing = ref(null) // the item being edited, or null when adding
const error = ref('')
const formKey = ref(0) // changing the key re-creates the form (clears it)

function handleSave(data) {
  const result = editing.value ? updateItem(editing.value.id, data) : addItem(data)
  if (!result.ok) {
    error.value = result.error
    return
  }
  cancel()
}

function startEdit(item) {
  editing.value = item
  error.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function cancel() {
  editing.value = null
  error.value = ''
  formKey.value++
  if (route.query.edit) router.replace('/items')
}

function remove(item) {
  if (confirm(`Delete "${item.itemName}"? This cannot be undone.`)) {
    deleteItem(item.id)
    if (editing.value?.id === item.id) cancel()
  }
}

// The details page links here with ?edit=<id>
onMounted(() => {
  const id = Number(route.query.edit)
  const item = items.value.find((i) => i.id === id)
  if (item) startEdit(item)
})

// READ: search + filter
const search = ref('')
const filter = ref('all')
const visible = computed(() =>
  items.value
    .filter((i) => {
      if (filter.value === 'borrowed') return !i.returnedDate
      if (filter.value === 'overdue') return isOverdue(i)
      if (filter.value === 'returned') return !!i.returnedDate
      return true
    })
    .filter((i) => {
      const q = search.value.toLowerCase()
      return i.itemName.toLowerCase().includes(q) || i.borrower.toLowerCase().includes(q)
    })
)
</script>

<template>
  <h1>📦 Items</h1>

  <ItemForm :key="formKey" :item="editing" :error="error" @save="handleSave" @cancel="cancel" />

  <section class="card">
    <div class="row">
      <input v-model="search" placeholder="🔍 Search by item or borrower" />
      <select v-model="filter">
        <option value="all">All</option>
        <option value="borrowed">Still borrowed</option>
        <option value="overdue">Overdue</option>
        <option value="returned">Returned</option>
      </select>
    </div>

    <div class="table-wrap">
      <table v-if="visible.length" class="data">
        <thead>
          <tr><th>Item</th><th>Borrower</th><th>Due date</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          <tr v-for="i in visible" :key="i.id">
            <td><strong>{{ i.itemName }}</strong><div class="muted small-text">{{ i.category }}</div></td>
            <td>{{ i.borrower }}</td>
            <td>{{ formatDate(i.dueDate) }}</td>
            <td><StatusBadge :item="i" /></td>
            <td class="actions">
              <RouterLink :to="`/items/${i.id}`" class="btn small">View</RouterLink>
              <button v-if="!i.returnedDate" class="btn small primary" @click="markReturned(i.id)">Returned</button>
              <button v-else class="btn small" @click="markBorrowed(i.id)">Undo</button>
              <button class="btn small" @click="startEdit(i)">Edit</button>
              <button class="btn small danger" @click="remove(i)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="muted empty">
        {{ items.length === 0 ? 'No items yet. Lend your first item above!' : 'No items match your search or filter.' }}
      </p>
    </div>
  </section>
</template>