<script setup>
import { reactive, watch, computed } from 'vue'
import { CATEGORIES } from '../data/categories'
import { todayStr } from '../utils/dates'

// Props down: the item being edited (or null when adding) and an error message.
const props = defineProps({
  item: { type: Object, default: null },
  error: { type: String, default: '' },
})
// Events up: tell the parent what happened.
const emit = defineEmits(['save', 'cancel'])

const empty = () => ({
  itemName: '', category: CATEGORIES[0], borrower: '', contact: '',
  dateBorrowed: todayStr(), dueDate: '', notes: '',
})
const form = reactive(empty())

// Fill the form when an item is chosen for editing.
watch(
  () => props.item,
  (i) => {
    const values = i
      ? { itemName: i.itemName, category: i.category, borrower: i.borrower, contact: i.contact,
          dateBorrowed: i.dateBorrowed, dueDate: i.dueDate, notes: i.notes }
      : empty()
    Object.assign(form, values)
  },
  { immediate: true }
)

const isEdit = computed(() => !!props.item)
</script>

<template>
  <form class="card" @submit.prevent="emit('save', { ...form })">
    <h2>{{ isEdit ? '✏️ Edit Item' : '➕ Lend an Item' }}</h2>
    <div class="form-grid">
      <label>Item name<input v-model="form.itemName" placeholder="Scientific calculator" /></label>
      <label>
        Category
        <select v-model="form.category">
          <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
        </select>
      </label>
      <label>Borrower<input v-model="form.borrower" placeholder="Juan Dela Cruz" /></label>
      <label>Contact (optional)<input v-model="form.contact" placeholder="0917 123 4567" /></label>
      <label>Date borrowed<input v-model="form.dateBorrowed" type="date" /></label>
      <label>Due date<input v-model="form.dueDate" type="date" /></label>
    </div>
    <label class="block">
      Notes (optional)
      <input v-model="form.notes" placeholder="Condition, reminders..." />
    </label>
    <p v-if="error" class="error">⚠️ {{ error }}</p>
    <div class="row top-gap">
      <button type="submit" class="btn primary">{{ isEdit ? 'Save changes' : 'Add item' }}</button>
      <button v-if="isEdit" type="button" class="btn" @click="emit('cancel')">Cancel</button>
    </div>
  </form>
</template>