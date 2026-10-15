<script setup>
import { computed } from 'vue'
import { isOverdue, daysLeft } from '../composables/useBorrowed'

const props = defineProps({
  item: { type: Object, required: true },
})

// computed: recalculates the label/color whenever the item changes
const info = computed(() => {
  const i = props.item
  if (i.returnedDate) return { cls: 'ok', text: 'Returned' }
  if (isOverdue(i)) return { cls: 'danger', text: `Overdue by ${Math.abs(daysLeft(i))} day(s)` }
  const d = daysLeft(i)
  return { cls: 'warn', text: d === 0 ? 'Due today' : `Due in ${d} day(s)` }
})
</script>

<template>
  <span class="badge" :class="info.cls">{{ info.text }}</span>
</template>