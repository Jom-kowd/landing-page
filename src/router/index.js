// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('../views/Home.vue') },
    { path: '/login', component: () => import('../views/Login.vue') },
    { 
      path: '/admin', 
      component: () => import('../views/Admin.vue'),
      meta: { requiresAuth: true } // We will check roles in the guard
    }
  ]
})

// Navigation Guard for Authorization
router.beforeEach(async (to, from, next) => {
  // Get current auth session
  const { data: { session } } = await supabase.auth.getSession()

  if (to.meta.requiresAuth) {
    if (!session) {
      return next('/login')
    }
    
    // Check if the authenticated user is an admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      alert("Unauthorized: Admins only.")
      return next('/') // Kick non-admins back to the landing page
    }
  }
  
  next()
})

export default router