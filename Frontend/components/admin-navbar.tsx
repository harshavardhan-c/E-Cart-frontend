"use client"

import { Menu, LogOut } from "lucide-react"
import Link from "next/link"

interface AdminNavbarProps {
  onMenuClick: () => void
}

export default function AdminNavbar({ onMenuClick }: AdminNavbarProps) {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">AD</span>
            </div>
            <span className="font-bold text-gray-900">Admin Panel</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600">Admin User</span>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Exit Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
