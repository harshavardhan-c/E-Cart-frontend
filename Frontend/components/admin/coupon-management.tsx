"use client"

import type React from "react"

import { useState } from "react"
import { useAppSelector } from "@/hooks/use-app-selector"
import { useAppDispatch as useDispatch } from "@/hooks/use-app-dispatch"
import { addCoupon, deleteCoupon } from "@/store/slices/adminSlice"
import { Edit2, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CouponManagement() {
  const coupons = useAppSelector((state) => state.admin.coupons)
  const dispatch = useDispatch()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    code: "",
    discount: 0,
    expiryDate: "",
    maxUses: 0,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.code || !formData.discount || !formData.expiryDate) {
      alert("Please fill all fields")
      return
    }

    const newCoupon = {
      id: Math.random().toString(36).substr(2, 9),
      code: formData.code,
      discount: Number(formData.discount),
      expiryDate: formData.expiryDate,
      maxUses: Number(formData.maxUses),
      currentUses: 0,
    }

    dispatch(addCoupon(newCoupon))
    setFormData({ code: "", discount: 0, expiryDate: "", maxUses: 0 })
    setShowAddForm(false)
  }

  const handleDeleteCoupon = (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      dispatch(deleteCoupon(id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Add Coupon
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Coupon</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddCoupon} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Coupon Code</label>
                <Input
                  name="code"
                  placeholder="e.g., SAVE20"
                  value={formData.code}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Discount (%)</label>
                <Input
                  type="number"
                  name="discount"
                  placeholder="20"
                  value={formData.discount}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Expiry Date</label>
                <Input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Max Uses</label>
                <Input
                  type="number"
                  name="maxUses"
                  placeholder="100"
                  value={formData.maxUses}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2 flex gap-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Save Coupon
                </Button>
                <Button type="button" onClick={() => setShowAddForm(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Coupons Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Code</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Discount</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Expiry Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Uses</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-600">
                      No coupons yet. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-900">{coupon.code}</td>
                      <td className="py-3 px-4 text-gray-600">{coupon.discount}%</td>
                      <td className="py-3 px-4 text-gray-600">{coupon.expiryDate}</td>
                      <td className="py-3 px-4 text-gray-600">
                        {coupon.currentUses}/{coupon.maxUses}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
