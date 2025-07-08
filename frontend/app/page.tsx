"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { EmployeeDashboard } from "@/components/employee/employee-dashboard"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"

// Define a User type
interface User {
  name?: string
  username?: string
  role: string
  [key: string]: any
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showRegister, setShowRegister] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser))
    }
  }, [])

  // Fetch user info after login using the token
  const handleLogin = async (token: string) => {
    localStorage.setItem("token", token)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      setCurrentUser(payload)
      localStorage.setItem("currentUser", JSON.stringify(payload))
    } catch {
      setCurrentUser(null)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
    localStorage.removeItem("token")
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Building2 className="h-12 w-12 text-blue-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Gramtek Portal</CardTitle>
              <p className="text-gray-600">Employee Complaint & Feedback System</p>
            </CardHeader>
            <CardContent>
              {showRegister ? (
                <RegisterForm onRegister={() => setShowRegister(false)} onSwitchToLogin={() => setShowRegister(false)} />
              ) : (
                <LoginForm onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Gramtek Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {currentUser?.name ?? currentUser?.username ?? "User"} ({currentUser.role})
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {currentUser.role === "admin" ? (
          <AdminDashboard currentUser={currentUser} />
        ) : (
          <EmployeeDashboard currentUser={currentUser} />
        )}
      </main>
    </div>
  )
}
