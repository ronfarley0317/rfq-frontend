'use client'

import { createClient } from '@/utils/supabase/client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1565793298595-6a879b1d9492?q=80&w=2071&auto=format&fit=crop)'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Login card */}
      <div className="relative z-10 max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Sign In
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900"
              />
              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
