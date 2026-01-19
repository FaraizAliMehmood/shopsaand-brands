import React, { useState, useEffect } from 'react'
import { useProduct } from '../context/ProductContext'
import type { Product } from '../types'

const Product = () => {
  // Use ProductContext
  const {
    products,
    isLoading,
    error,
    getProducts,
    createProduct,
    updateProduct: updateProductContext,
    deleteProduct,
    toggleProductStatus,
    clearError
  } = useProduct()

  // Local state for form and UI
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0.0,
    category: '',
    stock: 0, // Backend expects 'status' not 'isActive'
    isNew: false,
    isOnSale: false,
    salePrice: 0.0,
    isActive: true,
    isFeatured: false
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [showActionPopup, setShowActionPopup] = useState<string | null>(null)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null)
  const [showViewModal, setShowViewModal] = useState(false)

    useEffect(()=>{
      getProducts(1, 10);
    },[])

  const categories = {
    'Clothing': [
      'Tops (tees, blouses, tanks)',
      'Bottoms (pants, skirts, shorts)',
      'Outerwear (jackets, coats, blazers)',
      'Dresses & Jumpsuits',
      'Loungewear & Sleepwear',
      'Swimwear',
      'Activewear & Athleisure',
      'Undergarments & Intimates'
    ],
    'Shoes': [
      'Sneakers',
      'Boots',
      'Sandals',
      'Heels',
      'Flats',
      'Slippers',
      'Specialty (e.g., dance shoes, vegan footwear)'
    ],
    'Accessories': [
      'Jewelry (earrings, rings, bracelets, necklaces)',
      'Hair Accessories (headbands, clips, scrunchies)',
      'Hats & Caps',
      'Scarves & Shawls',
      'Belts',
      'Sunglasses & Eyewear',
      'Gloves',
      'Socks & Hosiery',
      'Watches'
    ],
    'Bags': [
      'Totes',
      'Crossbody',
      'Clutches',
      'Backpacks',
      'Wallets & Cardholders',
      'Tech Cases (phone, laptop sleeves)'
    ],
    'Special': [
      'Custom Tailoring & Made-to-Measure',
      'Upcycled or Reworked Fashion',
      'Gender-Neutral / Unisex Apparel',
      'Cultural or Heritage Wear',
      'Festival & Occasion Wear'
    ],
    'Other': [
      'Fragrance & Perfume',
      'Fashion Stationery (brand-themed notebooks, stickers)',
      'Clothing Care (eco detergent, garment bags, steamer kits)',
      'Fashion Tech (wearable devices, smart accessories)'
    ]
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category || !formData.name || !formData.price || !formData.stock) {
      alert('Please fill in all required fields')
      return
    }
   
    const productData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      stock: formData.stock, // Backend expects 'status' not 'isActive'
      isNew: formData.isNew,
      isOnSale: formData.isOnSale,
      salePrice: formData.price - 10,
      isActive: true,
      isFeatured: false
    }

    console.log('Product data being sent:', productData);

    try {
      // Check authentication status
      const token = localStorage.getItem('token');
      console.log('Auth token exists:', !!token);
      console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'No token');

      const formDataToSend = new FormData();

      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('images', selectedImage as File);
        console.log('Image added to FormData:', selectedImage.name);
      } else {
        console.log('No image selected');
      }

      // Add product data
      formDataToSend.append('productData', JSON.stringify(productData));
      console.log('Product data added to FormData');

      await createProduct(formDataToSend)
      // Reset form on success
      setFormData({
        name: formData.name,
      description: formData.description,
      price: 0,
      category: formData.category,
      stock: 0, // Backend expects 'status' not 'isActive'
      isNew: formData.isNew,
      isOnSale: formData.isOnSale,
      salePrice: 0,
      isActive: true,
      isFeatured: false
      })
      setSelectedImage(null)
      setImagePreview('')
    } catch (error) {
      console.error('Failed to create product:', error);
      
      // Log more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      
      // Show user-friendly error message
      alert(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id)
      getProducts(1,10)
      setShowActionPopup(null)
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
  }

  const toggleProductAvailability = async(id: string) => {
    await toggleProductStatus(id)
    setShowActionPopup(null)
  }

  const toggleProductDisabled = (id: string) => {
  
    setShowActionPopup(null)
  }

  const editProduct = (product: Product) => {
    setEditingProduct(product)
    setIsEditMode(true)
    setFormData({
      category: product.category,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      isNew: product.isFeatured,
      isOnSale: false,
      isActive: true,
      isFeatured: false,
      salePrice: product.price - 10
    })
    setImagePreview(product.image[0] || '')
    setShowActionPopup(null)
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category || !formData.name || !formData.price || !formData.stock) {
      alert('Please fill in all required fields')
      return
    }

    if (editingProduct) {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        stock: formData.stock, // Backend expects 'status' not 'isActive'
        isNewProduct: true,
        isOnSale: formData.isOnSale,
        salePrice: formData.price - 10,
        isActive: true,
        isFeatured: false
      }

      try {
        console.log('Sending product data:', productData);
        console.log('Editing product ID:', editingProduct._id);
        await updateProductContext(editingProduct._id, productData)
       // getProducts(1, 10);
        // Reset form
        // setFormData({
        //   category: '',
        //   name: '',
        //   description: '',
        //   price: '',
        //   stock: '',
        //   isNew: false,
        //   isOnSale: false,
        //   salePrice: '',
        //   tags: '',
        //   specifications: ''
        // })
        setSelectedImage(null)
        setImagePreview('')
        setEditingProduct(null)
        setIsEditMode(false)
      } catch (error) {
        console.error('Failed to update product:', error)
      }
    }
  }

  const cancelEdit = () => {
    setFormData({
       name: '',
        description: '',
        price: 0.0,
        category: '',
        stock: 0,
        isNew: false,
        isOnSale: false,
        salePrice: 0.0,
        isActive: false,
        isFeatured: false
    })
    setSelectedImage(null)
    setImagePreview('')
    setEditingProduct(null)
    setIsEditMode(false)
  }

  const viewProduct = (product: Product) => {
    setViewingProduct(product)
    setShowViewModal(true)
    setShowActionPopup(null)
  }

  const closeViewModal = () => {
    setShowViewModal(false)
    setViewingProduct(null)
  }

  // Close popup when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (showActionPopup && !(e.target as HTMLElement).closest('.action-popup')) {
      setShowActionPopup(null)
    }
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 p-4 md:p-8" onClick={handleClickOutside}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Management</h1>
        
        {/* Product Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h2>
            {isEditMode && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel Edit
              </button>
            )}
          </div>
          
          <form onSubmit={isEditMode ? handleUpdateProduct : handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select Category</option>
                  {Object.entries(categories).map(([mainCategory, subCategories]) => (
                    <optgroup key={mainCategory} label={mainCategory}>
                      {subCategories.map((subCategory) => (
                        <option key={subCategory} value={subCategory}>
                          {subCategory}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              {/* Product Picture */}
              <div className="md:col-span-2">
                
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                    />
                  </div>
                )}
                
                <div className="space-y-3">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dull"
                    />
                  </div>
                  
                  {/* OR Divider */}
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-sm text-gray-500">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>
                  
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0"
                />
              </div>

              {/* Sale Price (conditional) */}
              {formData.isOnSale && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price ($)
                  </label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">New Product</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isOnSale"
                  checked={formData.isOnSale}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">On Sale</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full md:w-auto bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dull transition-colors duration-200 font-medium"
            >
              {isEditMode ? 'Update Product' : 'Add Product'}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={clearError}
                    className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Products ({products.length})</h2>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading products...</span>
            </div>
          ) : products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.image && product.image.length > 0 ? (
                          <img
                            src={product.image[0]}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo='
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{product.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span>${product.price}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.stock > 10 
                            ? 'bg-green-100 text-green-800' 
                            : product.stock > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.isAvailable
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                         {product.isAvailable ? 'Active' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {product.status === 'active' && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              {product.status}
                            </span>
                          )}
                          {product.status !== 'active' && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                             {product.status}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                        <button
                          onClick={() => setShowActionPopup(showActionPopup === product._id ? null : product._id)}
                          className="text-gray-600 hover:text-gray-900 transition-colors duration-200 flex items-center"
                        >
                          Actions
                          <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {/* Action Popup */}
                        {showActionPopup === product._id && (
                          <div className="action-popup absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                            <div className="py-1">
                              <button
                                onClick={() => viewProduct(product)}
                                className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              >
                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Product
                              </button>
                              <button
                                onClick={() => editProduct(product)}
                                className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              >
                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit Product
                              </button>
                              <button
                                onClick={() => toggleProductAvailability(product._id)}
                                className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              >
                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {product.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                onClick={() => toggleProductDisabled(product._id)}
                                className="flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                              >
                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                                </svg>
                                Toggle Featured
                              </button>
                              <hr className="my-1" />
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="flex w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                              >
                                <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Product
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
            </div>
          )}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new product.</p>
          </div>
        )}

        {/* View Product Modal */}
        {showViewModal && viewingProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
                  <button
                    onClick={closeViewModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Product Image */}
                <div className="mb-6 flex justify-center">
                  {viewingProduct.image && viewingProduct.image.length > 0 ? (
                    <div className="max-w-md w-full">
                      <img
                        src={viewingProduct.image[0]}
                        alt={viewingProduct.name}
                        className="w-full h-auto max-h-80 object-contain rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzNkMzMC42Mjc0IDM2IDM2IDMwLjYyNzQgMzYgMjRDMzYgMTcuMzcyNiAzMC42Mjc0IDEyIDI0IDEyQzE3LjM3MjYgMTIgMTIgMTcuMzcyNiAxMiAyNEMxMiAzMC42Mjc0IDE3LjM3MjYgMzYgMjQgMzZaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik0yNCAyOEMyNi4yMDkxIDI4IDI4IDI2LjIwOTEgMjggMjRDMjggMjEuNzkwOSAyNi4yMDkxIDIwIDI0IDIwQzIxLjc5MDkgMjAgMjAgMjEuNzkwOSAyMCAyNEMyMCAyNi4yMDkxIDIxLjc5MDkgMjggMjQgMjhaIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo='
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full max-w-md h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Product Information */}
                <div className="space-y-4">
                  {/* Product Name */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{viewingProduct.name}</h3>
                  </div>

                  {/* Category */}
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category:</span>
                    <p className="text-gray-900">{viewingProduct.category}</p>
                  </div>

                  {/* Price */}
                  <div>
                    <span className="text-sm font-medium text-gray-500">Price:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">${viewingProduct.price}</span>
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <span className="text-sm font-medium text-gray-500">Stock:</span>
                    <p className="text-gray-900">{viewingProduct.stock} units</p>
                  </div>

                  {/* Status Badges */}
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        viewingProduct.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {viewingProduct.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {viewingProduct.isFeatured && (
                        <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeViewModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      closeViewModal()
                      editProduct(viewingProduct)
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dull transition-colors duration-200"
                  >
                    Edit Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
 

     
      </div>
    </div>
  )
}

export default Product
