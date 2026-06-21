import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const decodePayload = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return {}
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('avss_token') || null)

  const payload = token ? decodePayload(token) : {}
  const role    = payload.role || null
  const adminId = payload.id   || null

  const login = (jwt) => {
    localStorage.setItem('avss_token', jwt)
    setToken(jwt)
  }

  const logout = () => {
    localStorage.removeItem('avss_token')
    setToken(null)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, role, adminId, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}