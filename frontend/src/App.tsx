import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import LoginForm from './components/LoginForm'
import RegisterForm from './components/RegisterForm'

interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
}

function App() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token)
  const [error, setError] = useState<string | null>(null)
  const [showRegister, setShowRegister] = useState<boolean>(false)

  useEffect(() => {
    if (token) {
      fetchUserInfo()
    }
  }, [token])

  const fetchUserInfo = async () => {
    if (!token) return

    try {
      const response = await fetch('http://localhost:5001/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          logout()
          throw new Error('Sesión expirada')
        }
        throw new Error('Error al obtener información del usuario')
      }

      const data = await response.json()
      setUser(data)
      setIsLoggedIn(true)
    } catch (error) {
      console.error("Error fetching user info:", error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        setError('Usuario o contraseña incorrectos')
        return false
      }

      const data = await response.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        setIsLoggedIn(true)
        setError(null)
        return true
      }

      return false
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
      return false
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Error al registrar usuario')
        return false
      }

      setError(null)
      setShowRegister(false)
      return true
    } catch (error) {
      console.error("Error durante el registro:", error)
      setError(error instanceof Error ? error.message : 'Error desconocido')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    setIsLoggedIn(false)
  }

  const switchToRegister = () => {
    setShowRegister(true)
    setError(null)
  }

  const switchToLogin = () => {
    setShowRegister(false)
    setError(null)
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Sistema de Autenticación</h1>
      
      <div className="row justify-content-center">
        <div className="col-md-6">
          {isLoggedIn && user ? (
            <div className="card">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0">Bienvenido, {user.username}</h4>
              </div>
              <div className="card-body">
                <p className="mb-3">Has iniciado sesión correctamente</p>
                <ul className="list-group mb-3">
                  <li className="list-group-item">
                    <strong>ID:</strong> {user.id}
                  </li>
                  <li className="list-group-item">
                    <strong>Usuario:</strong> {user.username}
                  </li>
                  <li className="list-group-item">
                    <strong>Email:</strong> {user.email || 'No disponible'}
                  </li>
                  <li className="list-group-item">
                    <strong>Rol:</strong> {user.role || 'Usuario'}
                  </li>
                </ul>
                <button className="btn btn-danger w-100" onClick={logout}>Cerrar Sesión</button>
              </div>
            </div>
          ) : (
            <>
              {showRegister ? (
                <RegisterForm 
                  onRegister={register} 
                  error={error} 
                  switchToLogin={switchToLogin} 
                />
              ) : (
                <LoginForm 
                  onLogin={login} 
                  error={error} 
                  switchToRegister={switchToRegister} 
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App 