'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import './home.css'

interface UserProfile {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
}

interface SignupData {
  email: string
  password: string
  username: string
  role: 'OPERATOR' | 'SUPERVISOR'
}

export default function Home() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showProfile, setShowProfile] = useState(false)
  const [loginData, setLoginData] = useState({
    username: '',  // Cambié email por username
    password: ''
  })
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    username: '',
    role: 'OPERATOR'
  })
  const [profile, setProfile] = useState<UserProfile>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  })

  // Lógica para manejar el inicio de sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      })

      if (!response.ok) {
        throw new Error('Credenciales inválidas')
      }

      const data = await response.json()

      if (data.token) {
        localStorage.setItem('token', data.token)

        // Redirigir basado en el rol
        if (data.user.role === 'OPERATOR') {
          router.push('/dashboard/operador')
        } else if (data.user.role === 'SUPERVISOR') {
          router.push('/dashboard/supervisor')
        }
        toast.success('¡Bienvenido!')
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Error al iniciar sesión')
    }
  }

  // Lógica para manejar el registro
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData),
      })

      if (!response.ok) {
        throw new Error('Error en el registro')
      }

      const data = await response.json()
      toast.success('Cuenta creada exitosamente')
      setIsLogin(true)
    } catch (error) {
      console.error('Signup error:', error)
      toast.error('Error al crear la cuenta')
    }
  }

  // Lógica para manejar la actualización del perfil
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile),
      })

      if (!response.ok) {
        throw new Error('Error actualizando el perfil')
      }

      toast.success('Perfil actualizado exitosamente')
      setShowProfile(false)
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Error al actualizar el perfil')
    }
  }

  return (
    <main className="login-container">
      <div className="login-header">
        <div className="logo-container">
          <div className="logo-circle">
            <Image
              src="/assets/logo.webp"
              alt="WCLID Logo"
              width={80}
              height={80}
              className="logo-image"
              priority
            />
          </div>
        </div>
        <h1 className="login-title">WCLID</h1>
        <p className="text-gray-600">Sistema de Gestión de Casos</p>
      </div>

      <Card className="login-card">
        <CardHeader>
          <CardTitle>{showProfile ? 'Editar Perfil' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}</CardTitle>
          <CardDescription>
            {showProfile 
              ? 'Actualiza tu información personal'
              : 'Ingresa tus credenciales para continuar'}
          </CardDescription>
        </CardHeader>

        {!showProfile ? (
          <CardContent>
            {isLogin ? (
              <form onSubmit={handleLogin} className="auth-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="username">Nombre de usuario</label>  {/* Cambié a username */}
                  <Input
                    id="username"
                    type="text"
                    value={loginData.username}  // Cambié email por username
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">Contraseña</label>
                  <Input
                    id="password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    required
                  />
                </div>
                <Button className="auth-button w-full" type="submit">
                  Iniciar Sesión
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="auth-form">
                <div className="form-group">
                  <label className="form-label" htmlFor="signupEmail">Email</label>
                  <Input
                    id="signupEmail"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="username">Nombre de usuario</label>
                  <Input
                    id="username"
                    type="text"
                    value={signupData.username}
                    onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="signupPassword">Contraseña</label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="role">Rol</label>
                  <select
                    id="role"
                    className="form-input"
                    value={signupData.role}
                    onChange={(e) => setSignupData({...signupData, role: e.target.value as 'OPERATOR' | 'SUPERVISOR'})}
                    required
                  >
                    <option value="OPERATOR">Operador</option>
                    <option value="SUPERVISOR">Supervisor</option>
                  </select>
                </div>
                <Button className="auth-button w-full" type="submit">
                  Crear Cuenta
                </Button>
              </form>
            )}

            <div className="auth-divider">o</div>

            <button 
              className="role-button w-full"
              onClick={() => setShowProfile(true)}
            >
              Editar Perfil
            </button>
          </CardContent>
        ) : (
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="auth-form">
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">Nombre</label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => setProfile({...profile, firstName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">Apellido</label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => setProfile({...profile, lastName: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">Teléfono</label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="address">Dirección</label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({...profile, address: e.target.value})}
                  required
                />
              </div>
              <Button className="auth-button w-full" type="submit">
                Guardar cambios
              </Button>
            </form>
          </CardContent>
        )}
      </Card>
    </main>
  )
}
