import { useState } from 'react'

interface KYCData {
  businessName: string
  businessAddress: string
  businessPhone: string
  businessLicenseNumber: string
  businessLogo: File | null
  businessLicensePicture: File | null
  businessOutlets: string
}

interface KYCApplication extends KYCData {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: Date
}

function Kyc() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showList, setShowList] = useState(false)
  const [kycData, setKycData] = useState<KYCData>({
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessLicenseNumber: '',
    businessLogo: null,
    businessLicensePicture: null,
    businessOutlets: ''
  })
  const [kycApplications, setKycApplications] = useState<KYCApplication[]>([])

  const handleInputChange = (field: keyof KYCData, value: string | File | null) => {
    setKycData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileUpload = (field: 'businessLogo' | 'businessLicensePicture', file: File | null) => {
    setKycData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    const newApplication: KYCApplication = {
      ...kycData,
      id: Date.now().toString(),
      status: 'pending',
      submittedAt: new Date()
    }
    
    setKycApplications(prev => [newApplication, ...prev])
    setShowList(true)
    
    // Reset form
    setKycData({
      businessName: '',
      businessAddress: '',
      businessPhone: '',
      businessLicenseNumber: '',
      businessLogo: null,
      businessLicensePicture: null,
      businessOutlets: ''
    })
    setCurrentStep(1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      case 'rejected':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  if (showList) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray50 to-gray100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">KYC Applications</h1>
                <p className="text-gray400">Manage your business verification applications</p>
              </div>
              <button
                onClick={() => setShowList(false)}
                className="bg-primary hover:bg-black text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                New Application
              </button>
            </div>
          </div>

          {/* Applications List */}
          <div className="grid gap-6">
            {kycApplications.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray600 mb-2">No Applications Yet</h3>
                <p className="text-gray400 mb-6">Submit your first KYC application to get started</p>
                <button
                  onClick={() => setShowList(false)}
                  className="bg-primary hover:bg-black text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Create Application
                </button>
              </div>
            ) : (
              kycApplications.map((app) => (
                <div key={app.id} className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray700">{app.businessName}</h3>
                      <p className="text-gray400 text-sm">{app.submittedAt.toLocaleDateString()}</p>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray500">Business Address:</span>
                      <p className="text-gray700">{app.businessAddress}</p>
                    </div>
                    <div>
                      <span className="text-gray500">Phone Number:</span>
                      <p className="text-gray700">{app.businessPhone}</p>
                    </div>
                    <div>
                      <span className="text-gray500">License Number:</span>
                      <p className="text-gray700">{app.businessLicenseNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray500">Business Outlets:</span>
                      <p className="text-gray700">{app.businessOutlets}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    {app.businessLogo && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        Logo Uploaded
                      </span>
                    )}
                    {app.businessLicensePicture && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        License Uploaded
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray50 to-gray100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* KYC Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-2">
              Business Verification
            </h1>
            <p className="text-gray400 text-sm sm:text-base">
              Complete your KYC process in 3 simple steps
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200 ${
                    currentStep >= step 
                      ? 'bg-primary text-white' 
                      : ' bg-gray-400 text-black'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-10 h-1 mx-2 transition-colors duration-200 ${
                      currentStep > step ? 'bg-primary' : 'bg-gray-400'
                    }`} />
                  )}
                </div>
              ))}
            </div>
           
          </div>

          {/* Form Content */}
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray700 mb-4">Business Information</h3>
                
                <div className="space-y-2">
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray600">
                    Business Name *
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    value={kycData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray700 placeholder-gray400"
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="businessAddress" className="block text-sm font-medium text-gray600">
                    Business Address *
                  </label>
                  <textarea
                    id="businessAddress"
                    value={kycData.businessAddress}
                    onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                    className="w-full px-4 py-3 border border-gray200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray700 placeholder-gray400 resize-none"
                    placeholder="Enter your complete business address"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="businessPhone" className="block text-sm font-medium text-gray600">
                    Business Phone Number *
                  </label>
                  <input
                    id="businessPhone"
                    type="tel"
                    value={kycData.businessPhone}
                    onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray700 placeholder-gray400"
                    placeholder="Enter your business phone number"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Business Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray700 mb-4">Business Details</h3>
                
                <div className="space-y-2">
                  <label htmlFor="businessLicenseNumber" className="block text-sm font-medium text-gray600">
                    Business License Number *
                  </label>
                  <input
                    id="businessLicenseNumber"
                    type="text"
                    value={kycData.businessLicenseNumber}
                    onChange={(e) => handleInputChange('businessLicenseNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray700 placeholder-gray400"
                    placeholder="Enter your business license number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="businessOutlets" className="block text-sm font-medium text-gray600">
                    Business Outlets *
                  </label>
                  <input
                    id="businessOutlets"
                    type="text"
                    value={kycData.businessOutlets}
                    onChange={(e) => handleInputChange('businessOutlets', e.target.value)}
                    className="w-full px-4 py-3 border border-gray200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray700 placeholder-gray400"
                    placeholder="Enter number of business outlets"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray700 mb-4">Business Documents</h3>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray600">
                    Business Logo *
                  </label>
                  <div className="border-2 border-dashed border-gray300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('businessLogo', e.target.files?.[0] || null)}
                      className="hidden"
                      id="businessLogo"
                      required
                    />
                    <label htmlFor="businessLogo" className="cursor-pointer">
                      <div className="w-12 h-12 bg-gray100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray600 mb-1">
                        {kycData.businessLogo ? kycData.businessLogo.name : 'Click to upload business logo'}
                      </p>
                      <p className="text-xs text-gray400">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray600">
                    Business License Picture *
                  </label>
                  <div className="border-2 border-dashed border-gray300 rounded-lg p-6 text-center hover:border-primary transition-colors duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('businessLicensePicture', e.target.files?.[0] || null)}
                      className="hidden"
                      id="businessLicensePicture"
                      required
                    />
                    <label htmlFor="businessLicensePicture" className="cursor-pointer">
                      <div className="w-12 h-12 bg-gray100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-gray400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray600 mb-1">
                        {kycData.businessLicensePicture ? kycData.businessLicensePicture.name : 'Click to upload license picture'}
                      </p>
                      <p className="text-xs text-gray400">PNG, JPG up to 10MB</p>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${
                  currentStep === 1
                    ? 'bg-gray200 text-gray400 cursor-not-allowed'
                    : 'bg-gray100 text-gray600 hover:bg-gray200'
                }`}
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-primary hover:bg-black text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-primary hover:bg-black text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Submit Application
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Kyc
