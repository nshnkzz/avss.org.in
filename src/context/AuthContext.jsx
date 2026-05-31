import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    // initialise from localStorage on page load
    return localStorage.getItem('avss_token') || null
  })

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
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}