"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // assuming you have email and password state
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.error || "Login failed");
      return;
    }

    const data = await res.json();

    // Store token (for later API calls)
    localStorage.setItem("token", data.token);

    // Redirect to current projectss
    router.push("/current-projects");
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong. Please try again.");
  }
};


  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-200 via-teal-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl relative">
        <div className="absolute right-15 top-1/2 -translate-y-1/2">
          <div className="w-64 h-64 bg-white  flex items-center justify-center overflow-hidden border-gray-100">
            <Image 
              src="/image.png" 
              alt="InSync Logo" 
              width={200} 
              height={200}
              className="object-contain"
            />
          </div>
        </div>

        <div className="space-y-6 max-w-md">
          <h1 className="text-xl font-semibold text-gray-800">Login</h1>

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm text-gray-600 mb-2 block">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-sm"
                autoComplete="email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm text-gray-600 mb-2 block">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-sm"
                autoComplete="current-password"
              />
            </div>
            {/*
             <div>
              <Label htmlFor="role" className="text-sm text-gray-600 mb-2 block">
                Select you role
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="w-full h-10 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-w-sm">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                </SelectContent>
              </Select>
            </div>*/}
          </form>

          <Button 
            onClick={handleLogin} 
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors max-w-sm"
            type="button"
          >
            Login
          </Button>

          <div className="text-center space-y-2 max-w-sm">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
