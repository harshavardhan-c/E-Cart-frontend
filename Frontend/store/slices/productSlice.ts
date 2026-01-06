import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { productsApi, type Product } from "../../src/api/productsApi"

export interface ProductState {
  items: Product[]
  filteredItems: Product[]
  selectedCategory: string
  searchQuery: string
  loading: boolean
  error: string | null
  currentProduct: Product | null
  searchResults: Product[]
}

const initialState: ProductState = {
  items: [],
  filteredItems: [],
  selectedCategory: "all",
  searchQuery: "",
  loading: false,
  error: null,
  currentProduct: null,
  searchResults: [],
}

// Async thunks
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const response = await productsApi.getProductsByCategory(category)
      return response.data.products
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async ({ category, id }: { category: string; id: string }, { rejectWithValue }) => {
    try {
      const response = await productsApi.getProductById(id)
      return response.data.product
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product')
    }
  }
)

export const searchProducts = createAsyncThunk(
  'products/search',
  async ({ query, category }: { query: string; category?: string }, { rejectWithValue }) => {
    try {
      const response = await productsApi.searchProducts(query, category)
      return response.data.products
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products')
    }
  }
)

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsApi.getAllProducts()
      return response.data.products
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all products')
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/create',
  async ({ category, productData }: { category: string; productData: Partial<Product> }, { rejectWithValue }) => {
    try {
      // Add category to productData since the API expects a single object
      const productWithCategory = { ...productData, category }
      const response = await productsApi.createProduct(productWithCategory)
      return response.data.product
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create product')
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ category, id, updateData }: { category: string; id: string; updateData: Partial<Product> }, { rejectWithValue }) => {
    try {
      // Add category to updateData if needed, but API only expects id and updateData
      const updateWithCategory = { ...updateData, category }
      const response = await productsApi.updateProduct(id, updateWithCategory)
      return response.data.product
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product')
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async ({ category, id }: { category: string; id: string }, { rejectWithValue }) => {
    try {
      await productsApi.deleteProduct(id)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product')
    }
  }
)

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.items = action.payload
      state.filteredItems = action.payload
    },
    filterByCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
      if (action.payload === "all") {
        state.filteredItems = state.items
      } else {
        state.filteredItems = state.items.filter((p) => p.category === action.payload)
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.filteredItems = action.payload
        state.error = null
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false
        state.currentProduct = action.payload
        state.error = null
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Search products
      .addCase(searchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.searchResults = action.payload
        state.error = null
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Fetch all products
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
        state.filteredItems = action.payload
        state.error = null
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.items.unshift(action.payload)
        state.filteredItems.unshift(action.payload)
        state.error = null
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false
        const index = state.items.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
          state.filteredItems[index] = action.payload
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload
        }
        state.error = null
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false
        state.items = state.items.filter(p => p.id !== action.payload)
        state.filteredItems = state.filteredItems.filter(p => p.id !== action.payload)
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null
        }
        state.error = null
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { 
  setProducts, 
  filterByCategory, 
  setSearchQuery, 
  setLoading, 
  setError, 
  clearError, 
  clearCurrentProduct, 
  clearSearchResults 
} = productSlice.actions

export default productSlice.reducer
