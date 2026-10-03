<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase'

const email = ref('')
const status = ref('idle') // idle, loading, success, error
const errorMessage = ref('')

const subscribe = async () => {
  if (!email.value) return
  status.value = 'loading'
  
  const { error } = await supabase
    .from('leads')
    .insert([{ email: email.value }])

  if (error) {
    // Handle Postgres unique constraint violation (duplicate email)
    if (error.code === '23505') {
       errorMessage.value = 'You are already on the waitlist!'
    } else {
       errorMessage.value = error.message
    }
    status.value = 'error'
  } else {
    status.value = 'success'
    email.value = ''
  }
}
</script>

<template>
  <main class="container">
    <h1>Our Next Big Thing</h1>
    <p>Sign up to get early access when we launch.</p>
    
    <div v-if="status === 'success'" class="success">
      Thanks for subscribing! Keep an eye on your inbox.
    </div>
    
    <form v-else @submit.prevent="subscribe">
      <input 
        v-model="email" 
        type="email" 
        placeholder="Enter your email" 
        required 
        :disabled="status === 'loading'"
      />
      <button type="submit" :disabled="status === 'loading'">
        {{ status === 'loading' ? 'Joining...' : 'Join Waitlist' }}
      </button>
    </form>
    
    <p v-if="status === 'error'" class="error">{{ errorMessage }}</p>
  </main>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: 20vh auto;
  text-align: center;
  font-family: system-ui, sans-serif;
}
input {
  padding: 0.75rem;
  width: 60%;
  margin-right: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 0.75rem 1.5rem;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled { 
  background: #a0d8c1; 
  cursor: not-allowed;
}
.error { color: #d32f2f; margin-top: 1rem; }
.success { 
  color: #2e7d32; 
  font-weight: bold; 
  background: #e8f5e9; 
  padding: 1rem; 
  border-radius: 4px;
}
</style>