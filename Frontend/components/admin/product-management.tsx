"use client"

import { useEffect, useMemo, useState } from "react"
import { Edit2, Trash2, Plus, ImageUp, X, Link2, PlusCircle, MinusCircle } from "lucide-react"
import { productsApi, type Product } from "@/src/api/productsApi"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/src/api/supabaseClient"

const CATEGORIES = [
  "Groceries",
  "Snacks",
  "Chocolates",
  "Beverages",
  "Cosmetics",
  "Dry Fruits",
  "Plastics",
  "Utensils",
  "Cookers",
  "Kitchen Essentials",
]

const STOCK_STATUS = ["In Stock", "Out of Stock"]

type ProductFormState = {
  id?: string
  name: string
  category: string
  description: string
  price: string
  discount?: string
  stock_quantity: string
  stock_status: string
  brand: string
  image_url?: string
  featured: boolean
  extra_images?: string[]
}

const emptyForm: ProductFormState = {
  name: "",
  category: "",
  description: "",
  price: "0",
  discount: "",
  stock_quantity: "0",
  stock_status: "",
  brand: "",
  image_url: "",
  featured: false,
  extra_images: [],
}

export default function ProductManagement() {
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<ProductFormState>(emptyForm)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const adminAuth = localStorage.getItem('adminAuth')
        const accessToken = localStorage.getItem('accessToken')
        setIsAuthenticated(Boolean(adminAuth && accessToken))
      }
    }
    checkAuth()
  }, [])

  const loadProducts = async () => {
    // Skip loading if not authenticated
    if (!isAuthenticated) {
      console.log("⚠️ Not authenticated, skipping product load")
      return
    }

    try {
      setLoading(true)
      console.log("🔄 Loading products from API...")
      const res = await productsApi.getAllProducts(1, 200)
      console.log("📦 API Response:", res)

      if (res?.data?.products) {
        setProducts(res.data.products)
        console.log(`✅ Loaded ${res.data.products.length} products from API`)
      } else {
        console.warn("⚠️ No products in API response, trying Supabase direct query...")
        await loadFromSupabase()
      }
    } catch (error: any) {
      console.error("❌ Error loading products:", error)
      // Only try Supabase fallback if we're authenticated
      if (isAuthenticated) {
        await loadFromSupabase(error)
      }
    } finally {
      setLoading(false)
    }
  }

  const loadFromSupabase = async (fallbackError?: any) => {
    if (!supabase) {
      toast({
        title: "Failed to load products",
        description: "Supabase is not configured properly",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("🔄 Attempting Supabase fallback...")
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200)

      if (error) throw error
      console.log(`✅ Fallback: Loaded ${data?.length || 0} products from Supabase`)
      setProducts(data || [])
      toast({
        title: "Products loaded from database",
        description: `Loaded ${data?.length || 0} products`,
      })
    } catch (err: any) {
      console.error("❌ Supabase fallback failed:", err)
      toast({
        title: "Failed to load products",
        description: fallbackError?.message || err?.message || "Unknown error",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts()
    }
  }, [isAuthenticated])

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products.filter((p) => {
      if (filterCategory && p.category.toLowerCase() !== filterCategory.toLowerCase()) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (("brand" in (p as any)) && String((p as any).brand).toLowerCase().includes(q))
      )
    })
  }, [products, search, filterCategory])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as any
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setImagePreview(undefined)
    setShowForm(false)
  }

  const validateForm = (): string | null => {
    if (!form.name.trim()) return "Product Name is required"
    if (!form.category) return "Category is required"
    if (!form.price || isNaN(Number(form.price))) return "Valid Price is required"
    if (!form.stock_quantity || isNaN(Number(form.stock_quantity))) return "Valid Stock Quantity is required"
    if (!form.stock_status) return "Stock Status is required"
    if (!form.brand.trim()) return "Brand Name is required"
    return null
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validateForm()
    if (err) {
      toast({ title: "Validation Error", description: err, variant: "destructive" })
      return
    }

    setSaving(true)
    try {
      const payload: Partial<Product> = {
        name: form.name.trim(),
        category: form.category,
        description: form.description,
        price: Number(form.price),
        discount: form.discount ? Number(form.discount) : undefined,
        stock: Number(form.stock_quantity),
        stock_status: form.stock_status,
        brand: form.brand,
        image_url: form.image_url,
        featured: form.featured,
        extra_images: form.extra_images || [],
      } as any

      if (form.id) {
        await productsApi.updateProduct(form.id, payload)
        toast({ title: "Product updated" })
      } else {
        await productsApi.createProduct(payload)
        toast({ title: "Product created" })
      }
      resetForm()
      await loadProducts()
    } catch (error: any) {
      toast({
        title: "Save failed",
        description: error?.response?.data?.message || error?.message || "Unknown error",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (p: Product) => {
    setForm({
      id: p.id,
      name: p.name,
      category: p.category,
      description: p.description || "",
      price: String(p.price ?? 0),
      discount: p.discount !== undefined ? String(p.discount) : "",
      stock_quantity: String((p as any).stock ?? (p as any).stock_quantity ?? 0),
      stock_status:
        (p as any).stock_status || ((p as any).stock > 0 ? "In Stock" : "Out of Stock"),
      brand: (p as any).brand || "",
      image_url: p.image_url || "",
      featured: Boolean((p as any).featured),
      extra_images: (p as any).extra_images || [],
    })
    setImagePreview(p.image_url)
    setShowForm(true)
  }

  const handleDelete = async (p: Product) => {
    try {
      if (!p.id) {
        throw new Error("Product ID missing.")
      }
      await productsApi.deleteProduct(p.id)
      toast({ title: "Product deleted" })
      await loadProducts()
    } catch (error: any) {
      console.error("Delete failed:", error?.response?.data || error)
      toast({
        title: "Delete failed",
        description: error?.response?.data?.message || error?.message || "Unknown error",
        variant: "destructive",
      })
    }
  }
  

  const handleUpload = async (file: File) => {
    console.log("🔄 Starting image upload process...")
    console.log("📁 File details:", { name: file.name, size: file.size, type: file.type })
    
    if (!supabase) {
      console.error("❌ Supabase not configured")
      toast({
        title: "Storage not configured",
        description: "Supabase storage is not properly configured",
        variant: "destructive",
      })
      return
    }

    const MAX_MB = 5
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

    if (!allowed.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please use JPG, PNG, or WEBP format",
        variant: "destructive",
      })
      return
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${MAX_MB}MB`,
        variant: "destructive",
      })
      return
    }

    // Generate unique filename outside try block so it's accessible in catch
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `product_${timestamp}_${randomId}.${ext}`
    const filePath = `products/${fileName}`

    try {
      // Show uploading state
      toast({
        title: "Uploading image...",
        description: "Please wait while we upload your image",
      })

      console.log("📤 Uploading to path:", filePath)

      // Try Supabase storage first, then fallback to local storage
      let uploadSuccess = false
      let finalImageUrl = ''
      
      try {
        // Convert file to ArrayBuffer for better compatibility
        const fileBuffer = await file.arrayBuffer()
        
        // Try uploading to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("public")
          .upload(filePath, fileBuffer, { 
            upsert: true,
            contentType: file.type
          })

        if (!uploadError && uploadData) {
          console.log("✅ Supabase upload successful:", uploadData)
          
          // Get public URL
          const { data: urlData } = supabase.storage.from("public").getPublicUrl(filePath)
          const publicUrl = urlData?.publicUrl
          
          if (publicUrl) {
            console.log("✅ Supabase public URL generated:", publicUrl)
            finalImageUrl = publicUrl
            uploadSuccess = true
          }
        } else {
          console.log("❌ Supabase upload failed:", uploadError?.message)
        }
      } catch (supabaseError) {
        console.log("❌ Supabase error:", supabaseError)
      }
      
      // If Supabase failed, try backend upload API
      if (!uploadSuccess) {
        console.log("🔄 Trying backend upload API...")
        
        try {
          const formData = new FormData()
          formData.append('image', file)
          
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload/product-image`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: formData
          })
          
          if (response.ok) {
            const result = await response.json()
            finalImageUrl = result.data.imageUrl
            uploadSuccess = true
            
            console.log("✅ Backend upload successful:", result.data)
            
            toast({ 
              title: "✅ Image uploaded successfully",
              description: "Product image has been uploaded to server!"
            })
          } else {
            throw new Error('Backend upload failed')
          }
        } catch (backendError) {
          console.log("❌ Backend upload failed:", backendError)
          
          // Final fallback: use local preview only
          const localImagePath = `/uploads/products/${fileName}`
          finalImageUrl = localImagePath
          
          console.log("📝 Using local preview only:", localImagePath)
          
          toast({
            title: "Using local preview",
            description: "Image preview loaded. Upload services unavailable.",
          })
          
          uploadSuccess = true
        }
      }
      
      // Set image preview
      if (finalImageUrl.startsWith('http') || finalImageUrl.startsWith('/uploads')) {
        setImagePreview(finalImageUrl)
      } else {
        setImagePreview(URL.createObjectURL(file))
      }

      // Update form state with the final image URL
      setForm((prev) => ({ ...prev, image_url: finalImageUrl }))
      
      toast({ 
        title: "✅ Image uploaded successfully",
        description: "Product image has been updated. Don't forget to save the product!"
      })
      
    } catch (error: any) {
      console.error("❌ Upload process failed:", error)
      
      // Even if upload fails, we can still use local preview
      try {
        const localImagePath = `/uploads/products/${fileName}`
        const previewUrl = URL.createObjectURL(file)
        
        setForm((prev) => ({ ...prev, image_url: localImagePath }))
        setImagePreview(previewUrl)
        
        toast({
          title: "Using local preview",
          description: "Image preview loaded. Upload may have failed but you can still save the product.",
          variant: "default"
        })
      } catch (fallbackError) {
        console.error("❌ Fallback also failed:", fallbackError)
        toast({
          title: "Upload failed",
          description: "Could not process the image. Please try a different file.",
          variant: "destructive",
        })
      }
    }
  }

  // ✅ Handle extra image upload
  const handleExtraImageUpload = async (file: File, index: number) => {
    if (!supabase) {
      toast({
        title: "Storage not configured",
        description: "Supabase storage is not available",
        variant: "destructive",
      })
      return
    }

    const MAX_MB = 5
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

    if (!allowed.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Use JPG, PNG, or WEBP",
        variant: "destructive",
      })
      return
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Max ${MAX_MB}MB allowed`,
        variant: "destructive",
      })
      return
    }

    try {
      toast({
        title: "Uploading extra image...",
        description: "Please wait while we upload your image",
      })

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
      const uuid =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2) + Date.now().toString(36)
      const path = `products/extra/${uuid}.${ext}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("public")
        .upload(path, file, { 
          upsert: false,
          contentType: file.type
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("public").getPublicUrl(path)
      const publicUrl = urlData?.publicUrl
      
      if (!publicUrl) throw new Error("Failed to get public URL")

      // Update the specific extra image URL
      updateExtraImage(index, publicUrl)
      
      toast({ 
        title: "✅ Extra image uploaded successfully",
        description: "Additional product image has been added"
      })
    } catch (error: any) {
      console.error("❌ Extra image upload failed:", error)
      toast({
        title: "Upload failed",
        description: error?.message || "Error uploading extra image",
        variant: "destructive",
      })
    }
  }

  // ✅ Extra image handlers
  const addExtraImage = () => {
    setForm((prev) => ({ ...prev, extra_images: [...(prev.extra_images || []), ""] }))
  }
  const removeExtraImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      extra_images: prev.extra_images?.filter((_, i) => i !== index),
    }))
  }
  const updateExtraImage = (index: number, value: string) => {
    const updated = [...(form.extra_images || [])]
    updated[index] = value
    setForm((prev) => ({ ...prev, extra_images: updated }))
  }

  // Show authentication message if not logged in
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Authentication Required</h2>
          <p className="text-yellow-700 mb-4">Please log in as an admin to access product management.</p>
          <a 
            href="/admin-login" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Admin Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-3xl font-bold text-gray-900">🛍️ Product Management</h1>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            <Plus className="w-5 h-5" />
            {showForm ? 'Close Form' : 'Add Product'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">{form.id ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
            <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Product Name", name: "name", placeholder: "Enter product name" },
              { label: "Category", name: "category", type: "select" },
              { label: "Description", name: "description", type: "textarea", placeholder: "Short description" },
              { label: "Price (₹)", name: "price", type: "number", placeholder: "0.00" },
              { label: "Discount (%)", name: "discount", type: "number", placeholder: "e.g. 10" },
              { label: "Stock Quantity", name: "stock_quantity", type: "number", placeholder: "e.g. 100" },
              { label: "Stock Status", name: "stock_status", type: "select2" },
              { label: "Brand Name", name: "brand", placeholder: "Enter brand" },
            ].map((f) => (
              <div key={f.name} className={`${f.type === "textarea" ? "md:col-span-2" : ""}`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                {f.type === "select" ? (
                  <select name="category" value={form.category} onChange={onChange} className="w-full px-3 py-2 text-sm border rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none">
                    <option value="" disabled>Select Category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : f.type === "select2" ? (
                  <select name="stock_status" value={form.stock_status} onChange={onChange} className="w-full px-3 py-2 text-sm border rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none">
                    <option value="" disabled>Select Stock Status</option>
                    {STOCK_STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea name={f.name} value={(form as any)[f.name]} onChange={onChange} placeholder={f.placeholder} rows={3} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700" />
                ) : (
                  <input name={f.name} type={f.type || "text"} value={(form as any)[f.name]} onChange={onChange} placeholder={f.placeholder} className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700" />
                )}
              </div>
            ))}

            {/* Main Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Product Image</label>
              <p className="text-xs text-gray-500 mb-3">
                Upload an image file or paste an image URL. The uploaded image will be stored and the URL will appear below.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <input 
                    id="main-image-upload"
                    type="file" 
                    accept="image/jpeg,image/png,image/webp,image/jpg" 
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleUpload(f)
                      // Reset input to allow same file upload again
                      e.target.value = ''
                    }} 
                    className="hidden" 
                  />
                  <label 
                    htmlFor="main-image-upload"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium cursor-pointer"
                  >
                    <ImageUp className="w-4 h-4" /> 
                    Upload Main Image
                  </label>
                  <span className="text-xs text-gray-500">JPG, PNG, WEBP (Max 5MB)</span>
                </div>
                
                {/* Current Image URL Input */}
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Image URL: 
                    {form.image_url && (
                      <span className="ml-2 text-green-600 font-medium">
                        {form.image_url.includes('supabase') ? '✅ Cloud Storage' : 
                         form.image_url.includes('/uploads/') ? '✅ Server Storage' : 
                         '✅ External URL'}
                      </span>
                    )}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      name="image_url"
                      value={form.image_url || ''}
                      onChange={onChange}
                      placeholder="https://example.com/image.jpg or paste URL here"
                      className="flex-1 px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700"
                      title={form.image_url || 'Enter or paste image URL'}
                    />
                    {form.image_url && (
                      <button
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, image_url: '' }))}
                        className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        title="Clear image URL"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  {form.image_url && (
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      Current: {form.image_url.length > 60 ? form.image_url.substring(0, 60) + '...' : form.image_url}
                    </p>
                  )}
                </div>

                {/* Image Preview */}
                {(imagePreview || form.image_url) && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm font-medium text-green-800">Image Ready</p>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="relative">
                        <img 
                          src={imagePreview || form.image_url} 
                          alt="Main product preview" 
                          className="w-24 h-24 rounded-lg object-cover border-2 border-green-300 shadow-sm" 
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setForm(prev => ({ ...prev, image_url: '' }))
                            setImagePreview(undefined)
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-green-700 mb-1">
                          ✅ Product image is ready to be saved
                        </p>
                        <p className="text-xs text-green-600">
                          This image will be used as the main product image when you save the product.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Extra Images */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Link2 className="w-4 h-4" /> Additional Product Images
              </label>
              <div className="space-y-3">
                {form.extra_images?.map((url, i) => (
                  <div key={i} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex gap-2 items-start mb-2">
                      <div className="flex-1">
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => updateExtraImage(i, e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeExtraImage(i)} 
                        className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                        title="Remove this image"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <input 
                        id={`extra-image-upload-${i}`}
                        type="file" 
                        accept="image/jpeg,image/png,image/webp,image/jpg" 
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          if (f) handleExtraImageUpload(f, i)
                          e.target.value = ''
                        }} 
                        className="hidden" 
                      />
                      <label 
                        htmlFor={`extra-image-upload-${i}`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium cursor-pointer hover:bg-green-700 transition-colors"
                      >
                        <ImageUp className="w-3 h-3" /> 
                        Upload File
                      </label>
                      <span className="text-xs text-gray-500">or paste URL above</span>
                    </div>

                    {/* Preview for extra image */}
                    {url && (
                      <div className="mt-2">
                        <img 
                          src={url} 
                          alt={`Extra image ${i + 1}`} 
                          className="w-20 h-20 rounded object-cover border shadow-sm" 
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                
                <button 
                  type="button" 
                  onClick={addExtraImage} 
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-4 h-4" /> Add Another Image
                </button>
                
                {(!form.extra_images || form.extra_images.length === 0) && (
                  <p className="text-xs text-gray-500 italic">
                    Add additional product images to showcase different angles or details
                  </p>
                )}
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input id="featured" name="featured" type="checkbox" checked={form.featured} onChange={onChange} className="accent-blue-600" />
              <label htmlFor="featured" className="text-sm text-gray-700">Featured (display on home page)</label>
            </div>

            <div className="md:col-span-2 flex gap-4 mt-2">
              <button type="submit" disabled={saving} className="flex-1 px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all text-sm">
                {saving ? 'Saving...' : 'Save Product'}
              </button>
              <button type="button" onClick={resetForm} className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-all text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Product</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Category</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Price</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Stock</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="py-6 px-6 text-center" colSpan={5}>Loading...</td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td className="py-6 px-6 text-center text-gray-500" colSpan={5}>No products found</td></tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                    <td className="py-4 px-6 flex items-center gap-3">
                      {product.image_url && (
                        <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded object-cover border" />
                      )}
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{product.category}</td>
                    <td className="py-4 px-6 font-semibold text-gray-800">₹{Number(product.price || 0).toFixed(2)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${((product as any).stock ?? 0) > 0 || (product as any).stock_status === 'In Stock'
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                        }`}>
                        {(((product as any).stock ?? 0) > 0 || (product as any).stock_status === 'In Stock')
                          ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
