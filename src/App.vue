<script setup>
// RouterLink / RouterView are registered globally by app.use(router)
</script>

<template>
  <header class="topbar">
    <div class="topbar-inner">
      <RouterLink to="/" class="brand">📦 Borrowed Items Tracker</RouterLink>
      <nav>
        <RouterLink to="/">Dashboard</RouterLink>
        <RouterLink to="/items">Items</RouterLink>
        <RouterLink to="/borrowers">Borrowers</RouterLink>
      </nav>
    </div>
  </header>

  <main class="page">
    <RouterView />
  </main>

  <footer class="footer">Borrowed Items Tracker System · Vue 3 + Vite + Vue Router</footer>
</template>