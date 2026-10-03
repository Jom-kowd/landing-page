<!-- src/views/Login.vue -->
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()
const email = ref('')
const password = ref('')
const isRegistering = ref(false)
const errorMsg = ref('')

const handleAuth = async () => {
  errorMsg.value = ''
  
  try {
    if (isRegistering.value) {
      const { error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      })
      if (error) throw error
      alert('Registration successful! You can now log in.')
      isRegistering.value = false // Switch to login mode
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
      })
      if (error) throw error
      router.push('/admin') // Redirect to dashboard on success
    }
  } catch (err) {
    errorMsg.value = err.message
  }
}
</script>

<template>
  <div class="auth-container">
    <h2>{{ isRegistering ? 'Create Account' : 'Admin Login' }}</h2>
    <form @submit.prevent="handleAuth">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">{{ isRegistering ? 'Sign Up' : 'Log In' }}</button>
    </form>
    
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    
    <p class="toggle" @click="isRegistering = !isRegistering">
      {{ isRegistering ? 'Already have an account? Log in' : 'Need an account? Sign up' }}
    </p>
  </div>
</template>

<style scoped>
.auth-container { max-width: 400px; margin: 10vh auto; text-align: center; font-family: system-ui; }
input { display: block; width: 100%; margin: 1rem 0; padding: 0.75rem; border: 1px solid #ccc; }
button { width: 100%; padding: 0.75rem; background: #2c3e50; color: white; border: none; cursor: pointer; }
.error { color: red; }
.toggle { margin-top: 1rem; color: #42b883; cursor: pointer; text-decoration: underline; }
</style>