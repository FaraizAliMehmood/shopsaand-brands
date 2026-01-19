import React, { useState } from 'react'

interface BrandProfile {
  businessName: string
  businessAddress: string
  businessPhone: string
  businessLicenseNumber: string
  businessOutlets: string
  businessLogo: string | null
  isVerified: boolean
  verificationDate: string
}

const Profile = () => {
  const [isEditingLogo, setIsEditingLogo] = useState(false)
  const [brandProfile, setBrandProfile] = useState<BrandProfile>({
    businessName: "TechCorp Solutions",
    businessAddress: "123 Business Street, Tech City, TC 12345",
    businessPhone: "+1 (555) 123-4567",
    businessLicenseNumber: "BL-2024-001234",
    businessOutlets: "5",
    businessLogo: null,
    isVerified: true,
    verificationDate: "2024-01-15"
  })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBrandProfile(prev => ({
          ...prev,
          businessLogo: e.target?.result as string
        }))
        setIsEditingLogo(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEditLogo = () => {
    setIsEditingLogo(true)
  }

  const handleCancelEdit = () => {
    setIsEditingLogo(false)
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">Brand Profile</h1>
              <p className="text-gray-400">Manage your brand information and verification status</p>
            </div>
            <div className="flex items-center gap-2">
              {brandProfile.isVerified && (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-full">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Verified</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Brand Logo Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Brand Logo</h2>
            {!isEditingLogo && (
              <button
                onClick={handleEditLogo}
                className="flex items-center gap-2 text-primary hover:text-black transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium">Edit Logo</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-6">
            {/* Logo Display */}
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border-2 border-gray-200">
                {brandProfile.businessLogo ? (
                  <img 
                    src={brandProfile.businessLogo} 
                    alt="Brand Logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              
              {/* Verified Badge */}
              {brandProfile.isVerified && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Logo Info */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{brandProfile.businessName}</h3>
              <p className="text-gray-500 text-sm mb-2">Business Logo</p>
              {brandProfile.isVerified && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Verified on {new Date(brandProfile.verificationDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Logo Section */}
          {isEditingLogo && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Upload New Logo
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logoUpload"
                    />
                    <label htmlFor="logoUpload" className="cursor-pointer">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Click to upload new logo</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-200 text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brand Information Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Brand Information</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Business Name</label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-700 font-medium">{brandProfile.businessName}</p>
              </div>
            </div>

            {/* Business Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Phone Number</label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-700 font-medium">{brandProfile.businessPhone}</p>
              </div>
            </div>

            {/* Business Address */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-gray-600">Business Address</label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-700 font-medium">{brandProfile.businessAddress}</p>
              </div>
            </div>

            {/* License Number */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">License Number</label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-700 font-medium">{brandProfile.businessLicenseNumber}</p>
              </div>
            </div>

            {/* Business Outlets */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-600">Business Outlets</label>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-700 font-medium">{brandProfile.businessOutlets} outlets</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Status Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Verification Status</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Business Verified</h3>
                  <p className="text-sm text-green-600">Your business has been successfully verified</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600 font-medium">
                  Verified on {new Date(brandProfile.verificationDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-blue-800">Logo Uploaded</span>
                </div>
                <p className="text-sm text-blue-600">Business logo is verified</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-green-800">License Verified</span>
                </div>
                <p className="text-sm text-green-600">Business license is valid</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium text-purple-800">Secure Profile</span>
                </div>
                <p className="text-sm text-purple-600">Profile is protected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
