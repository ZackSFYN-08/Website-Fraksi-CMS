import { ref, computed } from 'vue'
import api from '../services/api'

export const token = ref(localStorage.getItem('member_token') || null)
export const user = ref(null)
export const member = ref(null)

export const isLoggedIn = computed(() => !!token.value)

export const restoreSession = async () => {
  const saved = localStorage.getItem('member_token')
  if (!saved) return false
  try {
    const me = await api.getMe(saved)
    token.value = saved
    user.value = me
    
    // Fetch member profile by using the custom controller bypass
    const membersData = await api.getMembers({ me: 'true', populate: '*' }, saved)
    member.value = membersData && membersData.length > 0 ? membersData[0] : null
    
    return true
  } catch {
    localStorage.removeItem('member_token')
    token.value = null
    user.value = null
    member.value = null
    return false
  }
}

export const login = async (identifier, password) => {
  const data = await api.login(identifier, password)
  token.value = data.jwt
  user.value = data.user
  localStorage.setItem('member_token', data.jwt)
  
  // Fetch member profile
  const membersData = await api.getMembers({ me: 'true', populate: '*' }, data.jwt)
  member.value = membersData && membersData.length > 0 ? membersData[0] : null
  
  return data
}

export const logout = () => {
  localStorage.removeItem('member_token')
  token.value = null
  user.value = null
  member.value = null
}
