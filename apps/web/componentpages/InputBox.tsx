"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Palette,
  Plus,
  Users,
  Search,
  Home,
  Clock,
  Star,
  Settings,
  LogOut,
  Circle,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react"

const sidebarItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Clock, label: "Recent", active: false },
  { icon: Star, label: "Favorites", active: false },
  { icon: Users, label: "Shared", active: false },
]

// Color variations for room cards
const roomColors = [
  "from-yellow-400/20 to-yellow-500/20 border-yellow-400/30",
  "from-yellow-300/20 to-yellow-400/20 border-yellow-300/30",
  "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
  "from-yellow-400/20 to-yellow-500/20 border-yellow-400/30",
  "from-yellow-300/20 to-yellow-500/20 border-yellow-400/30",
  "from-yellow-500/20 to-yellow-400/20 border-yellow-500/30",
]
interface Room{
  id:string,
  roomname:string
}
export default function Dashboard() {
  const router = useRouter()
  const [roomId, setRoomId] = useState("")
  const [roomName, setRoomName] = useState("")
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [rooms, setRooms] = useState<Room[]>([])

  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get("http://localhost:3001/getrooms", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
      setRooms(response.data.rooms)
      console.log("Fetched rooms:", response.data)
    } catch (error) {
      console.error("Failed to fetch rooms:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return

    setIsCreating(true)
    try {
      const response = await axios.post(
        "http://localhost:3001/createroom",
        {
          roomname: roomName.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      )
      const newRoomId = response.data
      setIsCreateDialogOpen(false)
      setRoomName("")

      // Refresh rooms list to include the new room
      await fetchRooms()
      console.log("Room created successfully:", newRoomId)
      router.push(`/canva/${newRoomId.room.id}`)
    } catch (error) {
      console.error("Error creating room:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      router.push(`/canva/${roomId}`)
      setIsJoinDialogOpen(false)
      setRoomId("")
    }
  }

  const handleRoomClick = (id: string) => {

    router.push(`/streaming/${id}`)
  }

  const filteredRooms = rooms.filter((room) => room.roomname.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900/50 backdrop-blur-xl border-r border-yellow-400/20 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-yellow-400/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="font-semibold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                Canvacraft
              </h1>
              <p className="text-xs text-gray-400">Workspace</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-yellow-400/20">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 font-semibold mb-3">
                <Plus className="w-4 h-4 mr-2" />
                New Canvas
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border border-yellow-400/30">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Canvas</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Give your canvas a name to get started with collaborative drawing.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter canvas name (e.g., Design Workshop)"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="bg-gray-800 border-yellow-400/30 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === "Enter" && handleCreateRoom()}
                  autoFocus
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleCreateRoom}
                    disabled={!roomName.trim() || isCreating}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 flex-1"
                  >
                    {isCreating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Canvas
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      setRoomName("")
                    }}
                    disabled={isCreating}
                    className="bg-transparent text-gray-400 border-gray-600 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full bg-transparent text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10"
              >
                <Users className="w-4 h-4 mr-2" />
                Join Room
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border border-yellow-400/30">
              <DialogHeader>
                <DialogTitle className="text-white">Join Canvas Room</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Enter the room ID to join an existing canvas.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="bg-gray-800 border-yellow-400/30 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === "Enter" && handleJoinRoom()}
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleJoinRoom}
                    disabled={!roomId.trim()}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 flex-1"
                  >
                    Join
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsJoinDialogOpen(false)}
                    className="bg-transparent text-gray-400 border-gray-600 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  item.active
                    ? "bg-yellow-400/10 text-yellow-400 font-medium"
                    : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/5"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-yellow-400/20">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-yellow-400/20 text-yellow-400 text-sm">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">John Doe</p>
              <p className="text-xs text-gray-400 truncate">john@example.com</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-yellow-400 flex-1">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-yellow-400 flex-1">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-gray-900/50 backdrop-blur-xl border-b border-yellow-400/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Dashboard</h2>
              <p className="text-sm text-gray-400">Manage your collaborative canvases</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search canvases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 bg-gray-800 border-yellow-400/30 text-white placeholder-gray-400"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={fetchRooms}
                disabled={isLoading}
                className="bg-transparent text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/10"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/5 backdrop-blur-xl border border-yellow-400/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Canvases</p>
                    <p className="text-2xl font-semibold text-white">{rooms.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                    <Palette className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border border-yellow-400/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Available Rooms</p>
                    <p className="text-2xl font-semibold text-white">{filteredRooms.length}</p>
                  </div>
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Circle className="w-5 h-5 text-green-400 fill-current" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border border-yellow-400/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Quick Access</p>
                    <p className="text-2xl font-semibold text-white">Ready</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 backdrop-blur-xl border border-yellow-400/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="text-2xl font-semibold text-white">Online</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-400/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Your Canvases */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Your Canvases</h3>
              <Button variant="ghost" className="text-gray-400 hover:text-yellow-400" onClick={fetchRooms}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, index) => (
                  <Card key={index} className="bg-white/5 backdrop-blur-xl border border-yellow-400/20">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-white/10 rounded-t-lg animate-pulse" />
                      <div className="p-4">
                        <div className="h-4 bg-white/10 rounded animate-pulse mb-2" />
                        <div className="h-3 bg-white/5 rounded animate-pulse w-2/3" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms.map((room, index) => (
                  <motion.div
                    key={room.id}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoomClick(room.id)}
                    className="cursor-pointer"
                  >
                    <Card
                      className={`bg-gradient-to-br ${
                        roomColors[index % roomColors.length]
                      } backdrop-blur-xl border-2 hover:shadow-lg hover:shadow-yellow-400/10 transition-all`}
                    >
                      <CardContent className="p-0">
                        {/* Canvas Preview */}
                        <div className="aspect-video bg-white/10 backdrop-blur-sm rounded-t-lg flex items-center justify-center relative">
                          <div className="text-center text-gray-300">
                            <Palette className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-xs">Canvas Preview</p>
                          </div>
                          <div className="absolute top-3 left-3">
                            <Badge variant="secondary" className="bg-white/20 text-gray-300 text-xs">
                              Ready
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 text-gray-300 hover:text-yellow-400"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Add menu functionality here
                            }}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Canvas Info */}
                        <div className="p-4">
                          <h4 className="font-medium text-white mb-1 line-clamp-1">{room.roomname}</h4>
                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="w-5 h-5">
                              <AvatarFallback className="bg-yellow-400/20 text-yellow-400 text-xs">
                                {room.roomname
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-300">Room ID: {room.id}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Circle className="w-3 h-3 fill-current" />
                              <span>Available</span>
                            </div>
                            <Badge variant="secondary" className="text-xs bg-white/10 text-gray-300">
                              Canvas
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {!isLoading && filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {rooms.length === 0 ? "No canvases yet" : "No canvases found"}
                </h3>
                <p className="text-gray-400 mb-4">
                  {rooms.length === 0
                    ? "Create your first canvas to get started with collaborative drawing"
                    : "Try adjusting your search criteria"}
                </p>
                {rooms.length === 0 && (
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Canvas
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
