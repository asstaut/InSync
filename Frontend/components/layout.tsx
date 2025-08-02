"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Archive, Settings } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
 username: string;
  email: string;
  role: string;
};


interface LayoutProps {
  children: React.ReactNode
  title: string
  userRole?: "Student" | "Supervisor"
}

export function Layout({ children, title, userRole = "Student" }: LayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const isActive = (path: string) => {
    return pathname === path
  }
  const [showPopup, setShowPopup] = useState(false);
const [user, setUser] = useState<JwtPayload | null>(null);

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode<JwtPayload>(token);
    setUser(decoded);
  }
}, []);


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
              <Image 
                src="/image.png" 
                alt="InSync Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">InSync</h1>
            </div>
          </div>

          <div className="relative">
  <div
    className="flex items-center space-x-2 cursor-pointer"
    onClick={() => setShowPopup(!showPopup)}
  >
    <Avatar className="w-8 h-8 bg-blue-500">
      <AvatarFallback className="text-white text-sm font-medium">
        {user?.email?.[0]?.toUpperCase() || "U"}
      </AvatarFallback>
    </Avatar>
  </div>

  {showPopup && user && (
    <div className="absolute right-0 mt-2 w-64 bg-white shadow-md rounded-xl z-50 p-4">
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Username:</span> {user.username}
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Email:</span> {user.email}
      </p>
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Role:</span> {user.role}
      </p>
    </div>
  )}
</div>

        </div>
      </header>

      {/* yha vanda mathi */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-48 bg-white border-r border-gray-200 min-h-screen p-4 relative">
              <div className="flex">
        <aside className="w-48 bg-white border-gray-200 min-h-screen p-4 relative">
              <Image 
                            src="/image.png" 
                            alt="InSync Logo" 
                            width={200} 
                            height={200}
                            className="object-contain"
                          />
                        
            </aside>
          </div>
          <div className="absolute bottom-30 left-4 right-4">
            <nav className="space-y-1">
              <Button
                variant="ghost"
                className={`w-full justify-start text-sm ${
                  isActive("/archived-projects") ? "text-teal-600 bg-teal-50" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => handleNavigation("/archived-projects")}
              >
                <Archive className="w-4 h-4 mr-3" />
                Archives
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start text-sm ${
                  isActive("/current-projects") ? "text-teal-600 bg-teal-50" : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => handleNavigation("/current-projects")}
              >
                <div className="w-4 h-4 mr-3 rounded-full border-2 border-gray-400 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                Current Projects
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-gray-600 hover:bg-gray-50"
                onClick={() => handleNavigation("/login")}
              >
                <Settings className="w-4 h-4 mr-3" />
                Sign Out
              </Button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
