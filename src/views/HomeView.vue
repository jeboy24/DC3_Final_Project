<script setup>
import StatusBadge from '../components/StatusBadge.vue'
import { useBorrowed } from '../composables/useBorrowed'
import { formatDate } from '../utils/dates'

const { total, borrowedCount, overdueCount, returnedCount, dueSoon, loadSamples } = useBorrowed()

const links = [
  { to: '/items', icon: '📦', title: 'Items', text: 'Add, view, edit, return and delete borrowed items.' },
  { to: '/borrowers', icon: '👥', title: 'Borrowers', text: 'See who currently has your things.' },
]
</script>

<template>
  <section class="hero">
    <h1>Borrowed Items Tracker System</h1>
    <p>Ever lent something and forgot who has it? This system keeps track of what was borrowed, who has it, and when it's due back.</p>
    <RouterLink to="/items" class="btn primary big">Manage items →</RouterLink>
  </section>

  <section class="grid stats">
    <div class="card stat"><div class="num">{{ total }}</div><div class="muted">Total records</div></div>
    <div class="card stat"><div class="num warn-text">{{ borrowedCount }}</div><div class="muted">Still borrowed</div></div>
    <div class="card stat"><div class="num danger-text">{{ overdueCount }}</div><div class="muted">Overdue</div></div>
    <div class="card stat"><div class="num ok-text">{{ returnedCount }}</div><div class="muted">Returned</div></div>
  </section>

  <section class="card">
    <h2>Due soonest</h2>
    <div v-if="total === 0" class="empty">
      <p class="muted">Nothing tracked yet. Add an item, or load sample data to try the system.</p>
      <button class="btn primary" @click="loadSamples">Load sample data</button>
    </div>
    <p v-else-if="dueSoon.length === 0" class="muted">🎉 Everything has been returned!</p>
    <ul v-else class="plain">
      <li v-for="i in dueSoon" :key="i.id" class="due-row">
        <RouterLink :to="`/items/${i.id}`" class="grow"><strong>{{ i.itemName }}</strong> <span class="muted">→ {{ i.borrower }}</span></RouterLink>
        <span class="muted small-text">{{ formatDate(i.dueDate) }}</span>
        <StatusBadge :item="i" />
      </li>
    </ul>
  </section>

  <section class="grid">
    <RouterLink v-for="l in links" :key="l.to" :to="l.to" class="card link-card">
      <div class="icon">{{ l.icon }}</div>
      <h3>{{ l.title }}</h3>
      <p>{{ l.text }}</p>
    </RouterLink>
  </section>
</template>