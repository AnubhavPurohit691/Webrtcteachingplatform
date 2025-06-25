"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff, Sparkles } from "lucide-react"
import axios from "axios"
import { useRouter } from "next/navigation"

interface FormData {
  username: string
  email: string
  password: string
}

export default function AuthPage() {
  const [isSignup, setIsSignup] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error">("error")
  const router = useRouter()

  const [form, setForm] = useState<FormData>({
    username: "",
    email: "",
    password: "",
  })

  const handleInputChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (message) setMessage("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    const endpoint = isSignup ? "http://localhost:3001/signup" : "http://localhost:3001/signin"
    const payload = isSignup
      ? { username: form.username, email: form.email, password: form.password }
      : { email: form.email, password: form.password }

    try {
      const response = await axios.post(endpoint,payload)

      const data = response.data

      if (response.status === 200 && data.token) {
        localStorage.setItem("token", data.token)
        setMessage("Authentication successful!")
        setMessageType("success")
        setForm({ username: "", email: "", password: "" })
        router.push("/dashboard")
      } else {
        setMessage(data.error || "Authentication failed. Please try again.")
        setMessageType("error")
      }
    } catch (error) {
      setMessage("Network error. Please check your connection.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsSignup(!isSignup)
    setMessage("")
    setForm({ username: "", email: "", password: "" })
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  const buttonVariants: Variants = {
    hover: {
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(255, 193, 7, 0.3)",
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.98 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #fbbf24 0%, transparent 50%)",
            "radial-gradient(circle at 80% 20%, #fbbf24 0%, transparent 50%)",
            "radial-gradient(circle at 40% 80%, #fbbf24 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, #fbbf24 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-20"
          animate={{
            y: [-20, -100, -20],
            x: [0, 30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.5,
          }}
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
        />
      ))}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-white/95 backdrop-blur-xl border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 relative overflow-hidden">
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />

          <CardHeader className="space-y-4 text-center relative z-10 bg-white/80 backdrop-blur-sm">
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-yellow-600 to-gray-900 bg-clip-text text-transparent">
                {isSignup ? "Create Account" : "Welcome Back"}
              </CardTitle>
              <Sparkles className="w-6 h-6 text-yellow-500" />
            </motion.div>
            <motion.div variants={itemVariants}>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6 bg-white/90 backdrop-blur-sm relative z-10">
            <motion.form onSubmit={handleSubmit} className="space-y-5" variants={containerVariants}>
              <AnimatePresence mode="wait">
                {isSignup && (
                  <motion.div
                    key="username"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="username" className="text-gray-800 font-semibold">
                      Username
                    </Label>
                    <motion.div whileFocus={{ scale: 1.02 }}>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        value={form.username}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        required={isSignup}
                        className="bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 font-medium"
                      />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="email" className="text-gray-800 font-semibold">
                  Email Address
                </Label>
                <motion.div whileFocus={{ scale: 1.02 }}>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 font-medium"
                  />
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password" className="text-gray-800 font-semibold">
                  Password
                </Label>
                <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className="bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 font-medium pr-12"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-yellow-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </motion.button>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-500 text-black font-bold py-4 px-6 rounded-lg transition-all duration-300 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {isLoading && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{ x: [-100, 100] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {isSignup ? "Creating Account..." : "Signing In..."}
                      </>
                    ) : isSignup ? (
                      "Create Account"
                    ) : (
                      "Sign In"
                    )}
                  </span>
                </motion.button>
              </motion.div>
            </motion.form>

            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert
                    className={`border-2 ${
                      messageType === "success"
                        ? "bg-yellow-50 border-yellow-400 text-yellow-800"
                        : "bg-red-50 border-red-400 text-red-800"
                    } transition-all duration-200`}
                  >
                    <AlertDescription className="font-medium">{message}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="text-center pt-4 border-t border-gray-200">
              <motion.button
                onClick={toggleMode}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 hover:text-yellow-600 font-medium transition-colors duration-200 hover:underline"
              >
                {isSignup ? "Already have an account? Sign in" : "Don't have an account? Create one"}
              </motion.button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
