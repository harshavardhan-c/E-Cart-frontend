"use client"

import React, { useState } from "react"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAppDispatch } from "@/hooks/use-app-dispatch"
import { useAppSelector } from "@/hooks/use-app-selector"
import { setUser, sendOtp, verifyOtp } from "@/store/slices/userSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState(1)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { otpSent, loading, error, isAuthenticated, user } = useAppSelector((state) => state.user)

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/");
    }
  }, [isAuthenticated, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return
    await dispatch(sendOtp(formData.email))
    setStep(2)
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !otp) return
    const res = await dispatch(verifyOtp({ email: formData.email, otp, name: formData.name }))
    // If login/signup succeeded will be redirected by effect above
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-orange-600">Sign Up</CardTitle>
          <CardDescription>Join Lalitha Mega Mall and start shopping</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <Input
                type="text"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className="border-gray-300"
                disabled={otpSent}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="border-gray-300"
                disabled={otpSent}
                required
              />
            </div>
            {otpSent && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">OTP</label>
                <Input
                  type="text"
                  name="otp"
                  placeholder="6-digit code"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  className="border-gray-300"
                  maxLength={8}
                  required
                />
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading
                ? (otpSent ? "Verifying..." : "Sending OTP...")
                : (otpSent ? "Verify OTP" : "Send OTP")}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
