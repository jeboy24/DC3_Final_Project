<script setup>
import { ref, computed } from 'vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useBorrowed, isOverdue } from '../composables/useBorrowed'
import { formatDate } from '../utils/dates'

const { items } = useBorrowed()

const search = ref('')
const onlyActive = ref(false)

// computed: group every item by borrower name (case-insensitive) and count their items
const borrowers = computed(() => {
  const map = new Map()
  for (const item of items.value) {
    const key = item.borrower.trim().toLowerCase()
    if (!map.has(key)) map.set(key, { key, name: item.borrower, contact: '', items: [] })
    const b = map.get(key)
    if (!b.contact && item.contact) b.contact = item.contact
    b.items.push(item)
  }
  return [...map.values()]
    .map((b) => ({
      ...b,
      active: b.items.filter((i) => !i.returnedDate).length,
      overdue: b.items.filter(isOverdue).length,
    }))
    // most overdue first, then most items still borrowed
    .sort((a, b) => b.overdue - a.overdue || b.active - a.active || a.name.localeCompare(b.name))
})

const visible = computed(() =>
  borrowers.value
    .filter((b) => b.name.toLowerCase().includes(search.value.toLowerCase()))
    .filter((b) => !onlyActive.value || b.active > 0)
)
</script>

<template>
  <h1>👥 Borrowers</h1>
  <p class="muted">Who currently has your things? Borrowers with overdue items appear first.</p>

  <section class="card">
    <div class="row no-mb">
      <input v-model="search" placeholder="🔍 Search borrower" />
      <label class="inline-check">
        <input v-model="onlyActive" type="checkbox" /> Only with items still borrowed
      </label>
    </div>
  </section>

  <div v-if="visible.length" class="grid">
    <article v-for="b in visible" :key="b.key" class="card borrower">
      <div class="row between no-mb">
        <h3>{{ b.name }}</h3>
        <span v-if="b.overdue" class="badge danger">{{ b.overdue }} overdue</span>
        <span v-else-if="b.active" class="badge warn">{{ b.active }} borrowed</span>
        <span v-else class="badge ok">All returned</span>
      </div>
      <p v-if="b.contact" class="muted small-text">📞 {{ b.contact }}</p>

      <ul class="plain">
        <li v-for="i in b.items" :key="i.id" class="due-row">
          <RouterLink :to="`/items/${i.id}`" class="grow">
            <strong>{{ i.itemName }}</strong>
            <div class="muted small-text">Due {{ formatDate(i.dueDate) }}</div>
          </RouterLink>
          <StatusBadge :item="i" />
        </li>
      </ul>
    </article>
  </div>

  <p v-else class="muted empty">
    {{ items.length === 0 ? 'No borrowers yet. Lend an item on the Items page first.' : 'No borrowers match your search.' }}
  </p>
</template>