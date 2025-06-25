"use client"

import { useState } from "react"
import { motion, easeOut, easeInOut } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Palette,
  Users,
  Zap,
  Eye,
  Pencil,
  Share2,
  Play,
  ArrowRight,
  Sparkles,
  MousePointer,
  LogIn,
  Github,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState<string | null>(null)
    const router = useRouter()
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut }, // use imported easing function
    },
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: easeInOut, // use imported easing function
      },
    },
  }

  const features = [
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Draw together with your team in real-time. See every stroke as it happens.",
      color: "from-yellow-400 to-yellow-500",
    },
    {
      icon: Zap,
      title: "Live Event Streaming",
      description: "Stream all drawing events instantly. No lag, no delays, just pure creativity.",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Eye,
      title: "Live Cursors",
      description: "Watch teammates' cursors move in real-time. Feel truly connected.",
      color: "from-yellow-400 to-yellow-500",
    },
    {
      icon: Share2,
      title: "Instant Sharing",
      description: "Share your canvas with anyone, anywhere. Collaborate without boundaries.",
      color: "from-yellow-500 to-yellow-600",
    },
  ]

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Templates", href: "#templates" },
        { name: "Integrations", href: "#integrations" },
        { name: "API", href: "#api" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Blog", href: "#blog" },
        { name: "Press Kit", href: "#press" },
        { name: "Partners", href: "#partners" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#docs" },
        { name: "Help Center", href: "#help" },
        { name: "Community", href: "#community" },
        { name: "Tutorials", href: "#tutorials" },
        { name: "Changelog", href: "#changelog" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Cookie Policy", href: "#cookies" },
        { name: "GDPR", href: "#gdpr" },
        { name: "Security", href: "#security" },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute inset-0 opacity-5"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, #fbbf24 0%, transparent 70%)",
            "radial-gradient(circle at 80% 20%, #fbbf24 0%, transparent 70%)",
            "radial-gradient(circle at 40% 80%, #fbbf24 0%, transparent 70%)",
            "radial-gradient(circle at 20% 50%, #fbbf24 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-30"
          animate={{
            y: [-20, -120, -20],
            x: [0, 40, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + i,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.7,
          }}
          style={{
            left: `${5 + i * 12}%`,
            top: `${10 + i * 8}%`,
          }}
        />
      ))}

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative z-10">
        {/* Header */}
        <motion.header variants={itemVariants} className="container mx-auto px-6 py-8">
          <nav className="flex items-center justify-between">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <Palette className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                Canvacraft
              </span>
            </motion.div>

            <motion.div className="flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:text-yellow-400 hover:bg-white/10">
                Features
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-400 hover:bg-white/10">
                Pricing
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-400 hover:bg-white/10">
                Docs
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  className="bg-transparent text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10 hover:text-yellow-300"
                  onClick={() => router.push("/auth")}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold hover:from-yellow-500 hover:to-yellow-600"
                onClick={()=>router.push("/dashboard")}
                >
                  Get Started
                </Button>
              </motion.div>
            </motion.div>
          </nav>
        </motion.header>

        {/* Hero Section */}
        <motion.section variants={itemVariants} className="container mx-auto px-6 py-20 text-center">
          <motion.div className="max-w-4xl mx-auto" variants={containerVariants}>
            <motion.div variants={itemVariants} className="mb-8">
              <motion.h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight" variants={itemVariants}>
                <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                  Draw Together,
                </span>
                <br />
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                  Create Forever
                </span>
              </motion.h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Experience the future of collaborative drawing with{" "}
              <span className="text-yellow-400 font-semibold">real-time streaming</span> of every stroke, gesture, and
              creative moment. Built on Excalidraw's foundation, enhanced for the modern world.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-8 py-4 text-lg hover:from-yellow-500 hover:to-yellow-600 shadow-lg shadow-yellow-500/25"
                  onClick={() => router.push("/dashboard")}
                >
                  <Play className="w-5 h-5 mr-2" 
                  
                  />
                  Start Drawing Now
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-yellow-400 border-2 border-yellow-400/50 hover:bg-yellow-400/10 hover:text-yellow-300 px-8 py-4 text-lg"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Demo Preview */}
            <motion.div variants={itemVariants} className="relative max-w-4xl mx-auto">
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="bg-white/10 backdrop-blur-xl rounded-2xl border border-yellow-400/30 p-8 shadow-2xl shadow-yellow-400/10"
              >
                <div className="bg-white rounded-xl p-6 relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600 text-sm ml-4">canvacraft.app</span>
                  </div>

                  <div className="h-64 bg-gray-50 rounded-lg relative flex items-center justify-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      className="text-gray-400"
                    >
                      <Pencil className="w-16 h-16" />
                    </motion.div>

                    {/* Animated cursors */}
                    <motion.div
                      animate={{
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                      }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="absolute top-4 left-4"
                    >
                      <MousePointer className="w-4 h-4 text-blue-500" />
                    </motion.div>

                    <motion.div
                      animate={{
                        x: [0, -40, 0],
                        y: [0, 20, 0],
                      }}
                      transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                      className="absolute bottom-4 right-4"
                    >
                      <MousePointer className="w-4 h-4 text-green-500" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section variants={itemVariants} className="container mx-auto px-6 py-20">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need for seamless collaborative drawing and real-time creativity.
            </p>
          </motion.div>

          <motion.div variants={containerVariants} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                onHoverStart={() => setIsHovered(feature.title)}
                onHoverEnd={() => setIsHovered(null)}
                className="group"
              >
                <Card className="bg-white/10 backdrop-blur-xl border border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300 h-full">
                  <CardContent className="p-6 text-center">
                    <motion.div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center`}
                      animate={isHovered === feature.title ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <feature.icon className="w-8 h-8 text-black" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-yellow-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section variants={itemVariants} className="container mx-auto px-6 py-20">
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 backdrop-blur-xl rounded-3xl border border-yellow-400/30 p-12 text-center"
          >
            <motion.div variants={containerVariants}>
              <motion.div variants={itemVariants} className="flex justify-center mb-6">
                <Sparkles className="w-12 h-12 text-yellow-400" />
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent"
              >
                Ready to Start Creating?
              </motion.h2>

              <motion.p variants={itemVariants} className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of creators who are already using Canvacraft to bring their ideas to life in real-time.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold px-8 py-4 text-lg hover:from-yellow-500 hover:to-yellow-600"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent text-yellow-400 border-2 border-yellow-400/50 hover:bg-yellow-400/10 hover:text-yellow-300 px-8 py-4 text-lg"
                  >
                    Learn More
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Enhanced Footer */}
        <motion.footer variants={itemVariants} className="bg-gray-900/50 backdrop-blur-xl border-t border-gray-800">
          <div className="container mx-auto px-6 py-16">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <motion.div className="flex items-center gap-3 mb-6" whileHover={{ scale: 1.05 }}>
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                    <Palette className="w-6 h-6 text-black" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                    Canvacraft
                  </span>
                </motion.div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  The future of collaborative drawing. Create, share, and collaborate in real-time with teams around the
                  world.
                </p>
                <div className="flex items-center gap-4">
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1, color: "#fbbf24" }}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1, color: "#fbbf24" }}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ scale: 1.1, color: "#fbbf24" }}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </motion.a>
                </div>
              </div>

              {/* Footer Links */}
              {footerSections.map((section, index) => (
                <div key={index}>
                  <h3 className="text-white font-semibold mb-4">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <motion.a
                          href={link.href}
                          whileHover={{ color: "#fbbf24", x: 5 }}
                          className="text-gray-400 hover:text-yellow-400 transition-all duration-200"
                        >
                          {link.name}
                        </motion.a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Contact Info */}
            <div className="border-t border-gray-800 pt-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3 text-gray-300">
                  <Mail className="w-5 h-5 text-yellow-400" />
                  <span>hello@canvacraft.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Phone className="w-5 h-5 text-yellow-400" />
                  <span>Call me daddy</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-yellow-400" />
                  <span>Tumhara ghar</span>
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-400 text-sm">
                  © 2024 Canvacraft. All rights reserved. Built for creators, by creators.
                </p>
                <div className="flex items-center gap-6 text-sm">
                  <motion.a
                    href="#"
                    whileHover={{ color: "#fbbf24" }}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Status
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ color: "#fbbf24" }}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Sitemap
                  </motion.a>
                  <motion.a
                    href="#"
                    whileHover={{ color: "#fbbf24" }}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    Accessibility
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  )
}
