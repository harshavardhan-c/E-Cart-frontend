"use client"

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🛒 E-Cart - Lalitha Mega Mall
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your deployment is working! This is a simplified version.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900">✅ Build Success</h3>
            <p className="text-blue-700">Your Next.js app builds successfully</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900">✅ Deploy Success</h3>
            <p className="text-green-700">Your app is deployed on Vercel</p>
          </div>
          
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900">🚀 Ready to Go</h3>
            <p className="text-purple-700">Your e-commerce app is ready</p>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Environment Check:</h3>
          <div className="space-y-2 text-left max-w-md mx-auto">
            <div>Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌'}</div>
            <div>Supabase Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌'}</div>
            <div>API URL: {process.env.NEXT_PUBLIC_API_BASE_URL ? '✅' : '❌'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}