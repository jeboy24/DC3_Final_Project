<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusBadge from '../components/StatusBadge.vue'
import { useBorrowed } from '../composables/useBorrowed.js'
import { formatDate } from '../utils/dates.js'

const route = useRoute()
const router = useRouter()
const { items, markReturned, markBorrowed, deleteItem } = useBorrowed()

// The item comes from the URL: /items/:id
const item = computed(() => items.value.find((i) => i.id === Number(route.params.id)) ?? null)

function remove() {
  if (confirm(`Delete "${item.value.itemName}"? This cannot be undone.`)) {
    deleteItem(item.value.id)
    router.push('/items')
  }
}
</script>

<template>
  <RouterLink to="/items" class="muted">← Back to items</RouterLink>

  <section v-if="item" class="card top-gap">
    <div class="row between no-mb">
      <div>
        <h1>{{ item.itemName }}</h1>
        <span class="muted">{{ item.category }}</span>
      </div>
      <StatusBadge :item="item" class="big-badge" />
    </div>

    <table class="details">
      <tbody>
        <tr><td>Borrower</td><td>{{ item.borrower }}</td></tr>
        <tr><td>Contact</td><td>{{ item.contact || '—' }}</td></tr>
        <tr><td>Date borrowed</td><td>{{ formatDate(item.dateBorrowed) }}</td></tr>
        <tr><td>Due date</td><td>{{ formatDate(item.dueDate) }}</td></tr>
        <tr><td>Date returned</td><td>{{ formatDate(item.returnedDate) }}</td></tr>
        <tr><td>Notes</td><td>{{ item.notes || '—' }}</td></tr>
      </tbody>
    </table>

    <div class="row no-mb">
      <button v-if="!item.returnedDate" class="btn primary" @click="markReturned(item.id)">Mark as returned</button>
      <button v-else class="btn" @click="markBorrowed(item.id)">Undo return</button>
      <RouterLink :to="{ path: '/items', query: { edit: item.id } }" class="btn">Edit</RouterLink>
      <button class="btn danger" @click="remove">Delete</button>
    </div>
  </section>

  <p v-else class="muted empty">This item no longer exists. <RouterLink to="/items">Go back to the list</RouterLink>.</p>
</template>