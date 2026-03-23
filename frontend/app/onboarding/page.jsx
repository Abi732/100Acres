"use client"

import React, { useState, useEffect } from "react"
import { useUser } from "@clerk/clerk-react"
import axiosInstance from "@/store/axios"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const roles = ["owner", "buyer", "broker", "admin"]

const ROLE_DASHBOARD = {
  buyer:  "/customer",
  owner:  "/owner",
  broker: "/broker/broker",
  admin:  "/admin",
}

const Onboarding = () => {
  const { user, isLoaded } = useUser()
  const [selectedRole, setSelectedRole] = useState(null)
  const [loading,      setLoading]      = useState(false)
  const [checking,     setChecking]     = useState(true) // ← checking existing role
  const router = useRouter()

  // ✅ On mount — check if user is already onboarded
  // If they are, skip onboarding and redirect to their dashboard
  useEffect(() => {
    if (!isLoaded) return

    const checkExisting = async () => {
      try {
        const res = await axiosInstance.get("/users/me")

        if (res.data.success && res.data.user?.role) {
          // Already has a role → go straight to dashboard
          router.replace(ROLE_DASHBOARD[res.data.user.role] ?? "/")
          return
        }
      } catch (err) {
        // 404 means not onboarded yet — show the role picker
        // any other error — still show the picker
        console.log("User not onboarded yet, showing role picker")
      } finally {
        setChecking(false)
      }
    }

    checkExisting()
  }, [isLoaded])

  const handleSubmit = async () => {
    if (!selectedRole) return alert("Please select a role")

    try {
      setLoading(true)

      const res = await axiosInstance.post("/users/onboard", { role: selectedRole })

      if (res.data.success) {
        router.push(ROLE_DASHBOARD[selectedRole] ?? "/")
      } else {
        alert("Onboarding failed. Please try again.")
      }

    } catch (error) {
      console.error(error)
      alert("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Show spinner while checking existing role
  if (!isLoaded || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900">
      <Card className="w-[420px] shadow-xl">

        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Choose Your Role
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {roles.map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? "default" : "outline"}
                className="capitalize h-12 text-md"
                onClick={() => setSelectedRole(role)}
              >
                {role}
              </Button>
            ))}
          </div>

          <Button
            className="w-full h-11"
            onClick={handleSubmit}
            disabled={loading || !selectedRole}
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </CardContent>

      </Card>
    </div>
  )
}

export default Onboarding