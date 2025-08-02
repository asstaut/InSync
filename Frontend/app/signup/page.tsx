"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          {/* Cloud Logo */}
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-teal-400 rounded-full opacity-80"></div>
              <div className="w-14 h-14 bg-teal-400 rounded-full absolute -top-2 -left-2 opacity-90"></div>
              <div className="w-12 h-12 bg-teal-500 rounded-full absolute top-1 left-1 opacity-100"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 border border-white rounded-full relative">
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border border-white rounded-full"></div>
                    <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border border-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Insync</h1>
        </div>
        
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-50 border-gray-200 placeholder:text-gray-500"
          />

          <Input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-50 border-gray-200 placeholder:text-gray-500"
          />

          <Input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-gray-50 border-gray-200 placeholder:text-gray-500"
          />
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
            </div>

          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg mt-6">Sign Up</Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
