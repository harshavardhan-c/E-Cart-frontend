export default function TestPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 Vercel Deployment Test</h1>
      <p>If you can see this page, your Vercel deployment is working!</p>
      <p>Environment Variables:</p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>SUPABASE_URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</li>
        <li>SUPABASE_ANON_KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</li>
        <li>API_BASE_URL: {process.env.NEXT_PUBLIC_API_BASE_URL ? '✅ Set' : '❌ Missing'}</li>
      </ul>
    </div>
  )
}