<!-- src/views/Admin.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const leads = ref([])

onMounted(async () => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (!error && data) leads.value = data
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<template>
  <div class="admin-container">
    <header>
      <h2>Admin Dashboard</h2>
      <button @click="handleLogout" class="logout">Log Out</button>
    </header>

    <div class="stats">Total Leads: {{ leads.length }}</div>

    <table v-if="leads.length > 0">
      <thead>
        <tr>
          <th>Email</th>
          <th>Date Joined</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="lead in leads" :key="lead.id">
          <td>{{ lead.email }}</td>
          <td>{{ new Date(lead.created_at).toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>No leads collected yet.</p>
  </div>
</template>

<style scoped>
.admin-container { max-width: 800px; margin: 5vh auto; font-family: system-ui; }
header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.logout { background: #d32f2f; color: white; padding: 0.5rem 1rem; border: none; cursor: pointer; }
.stats { margin-bottom: 1rem; font-weight: bold; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 1rem; text-align: left; border-bottom: 1px solid #eee; }
th { background: #f8f9fa; }
</style>