'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Download, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [protocolName, setProtocolName] = useState<string>('')

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const id = urlParams.get('session_id')
    setSessionId(id)
    
    // In a real app, you would fetch the session details from your backend
    // For now, we'll use a default protocol name
    setProtocolName('Muscle Protection Protocol')
  }, [])

  const handleDownloadApp = () => {
    // In a real PWA, this would trigger the install prompt
    // For now, we'll show a message
    alert('App download will be available soon! For now, you can access your protocols through the web app.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Payment Successful</h1>
                <p className="text-sm text-gray-600">Welcome to GLIVA</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h2>
          
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. You now have access to your personalized protocol.
          </p>
          
          {sessionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Session ID:</strong> {sessionId}
              </p>
            </div>
          )}
        </div>

        {/* Protocol Access */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Your Protocol: {protocolName}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">What&apos;s Included:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Personalized protein recommendations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Supplement timing guide
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Meal planning templates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Progress tracking tools
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Next Steps:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                  Download the GLIVA app
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                  Access your protocol
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                  Start your journey
                </li>
                <li className="flex items-center">
                  <ArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                  Track your progress
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Download App */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Download the GLIVA App
          </h3>
          <p className="text-blue-100 mb-6">
            Get the full experience with our mobile app. Access your protocols anywhere, anytime.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleDownloadApp}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Download App
            </button>
            
            <Link
              href="/protocols"
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
            >
              Access Web App
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Need help? Contact our support team
          </p>
          <div className="flex justify-center space-x-4">
            <a href="mailto:support@gliva.app" className="text-blue-600 hover:text-blue-700">
              support@gliva.app
            </a>
            <span className="text-gray-400">|</span>
            <a href="/help" className="text-blue-600 hover:text-blue-700">
              Help Center
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

