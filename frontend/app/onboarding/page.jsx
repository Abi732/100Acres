"use client"

import React, { useState } from "react"
import { useUser } from "@clerk/clerk-react"
import axiosInstance from "@/store/axios"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const roles = ["owner", "buyer", "seller", "admin"]

const Onboarding = () => {
  const { user } = useUser()
  const [selectedRole, setSelectedRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  console.log(user);

  const handleSubmit = async () => {
    if (!selectedRole) return alert("Please select a role")

    try {
      setLoading(true)

      const role = selectedRole;

     try {
const res = await axiosInstance.post("/users/onboard", { role });

  if (res.data.success) {
    alert("Onboarding complete!");
    router.push("/");
  } else {
    alert("Onboarding failed. Please try again.");
  }

} catch (error) {
  console.error(error);
  alert("Something went wrong. Please try again.");
}

    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
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
            disabled={loading}
          >
            {loading ? "Saving..." : "Continue"}
          </Button>

        </CardContent>

      </Card>

    </div>
  )
}

export default Onboarding
