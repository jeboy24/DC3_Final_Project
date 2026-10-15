import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ItemsView from '../views/ItemsView.vue'
import BorrowersView from '../views/BorrowersView.vue'
import ItemDetailView from '../views/ItemDetailView.vue'

// Each object maps a URL path to a page component.
const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/items', name: 'items', component: ItemsView },
  { path: '/borrowers', name: 'borrowers', component: BorrowersView },
  // :id is a route parameter, e.g. #/items/1700000000000
  { path: '/items/:id', name: 'item-detail', component: ItemDetailView },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export default createRouter({
  // Hash mode (#/items) works on any static host without server config
  history: createWebHashHistory(),
  routes,
})