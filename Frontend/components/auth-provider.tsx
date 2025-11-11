"use client"

import type React from "react"

import { useEffect } from "react"
import { useAppDispatch } from "@/hooks/use-app-dispatch"
import { setUser } from "@/store/slices/userSlice"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        dispatch(setUser(user))
      } catch (error) {
        console.error("Failed to load user from storage:", error)
      }
    }
  }, [dispatch])

  return <>{children}</>
}
