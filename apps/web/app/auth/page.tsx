'use client'

import React, { FormEvent, useState } from 'react'

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true)
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [message, setMessage] = useState('')

  const handleChange = (e:any) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e:FormEvent) => {
    e.preventDefault()
    setMessage('')
    const endpoint = isSignup ? 'http://localhost:3001/signup' : 'http://localhost:3001/signin'
    const payload = isSignup
      ? { username: form.username, email: form.email, password: form.password }
      : { email: form.email, password: form.password }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token)
        setMessage('Success! Token stored.')
      } else {
        setMessage(data.error || 'Authentication failed.')
      }
    } catch (err) {
      setMessage('Network error.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-xl font-bold mb-4">{isSignup ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignup && (
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {isSignup ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <button
        onClick={() => setIsSignup(!isSignup)}
        className="mt-4 text-blue-600 underline"
      >
        {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </button>
      {message && <div className="mt-4 text-red-600">{message}</div>}
    </div>
  )
}
