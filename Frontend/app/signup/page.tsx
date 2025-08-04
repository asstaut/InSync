"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from"next/image"

export default function SignUpPage() {
  const router = useRouter()
  //const [title, setTitle] = useState('Signup');
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {

    setError(null)
    setSuccess(null)

    if (!username || !email || !password || !confirmPassword || !role) {
      setError("Please fill in all fields.")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    try {
      setLoading(true)
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
          role,
        }),
      })

      const data = await res.json().catch(() => ({}))

      setLoading(false)

      if (!res.ok) {
        setError(data.error || "Signup failed.")
        return
      }

      setSuccess("Signup successful! Redirecting to login...")
      router.push("/login")
    } catch (err) {
      console.error(err)
      setLoading(false)
      setError("Something went wrong. Please try again later.")
    }
  }

  return (
    <>
    <head><title>Signup</title></head>

   <div className="min-h-screen bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              {/* <div className="w-16 h-16 bg-teal-400 rounded-full opacity-80"></div>
              <div className="w-14 h-14 bg-teal-400 rounded-full absolute -top-2 -left-2 opacity-90"></div>
              <div className="w-12 h-12 bg-teal-500 rounded-full absolute top-1 left-1 opacity-100"></div> */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 border border-white rounded-full relative">
                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border border-white rounded-full"></div>
                    <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border border-white rounded-full"></div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
          <div className="text-center mb-1">
          <div className="inline-flex items-center justify-center mb-4">
            <Image 
              src="/image.png" 
              alt="InSync Logo" 
              width={150} 
              height={150}
              className="object-contain mx-auto"
            />
          </div>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900">Insync</h1>
        </div>          

        <div className="space-y-4">

          <Input
            type="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-50 border-gray-200 placeholder:text-gray-500"
          />

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
              Select your role
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

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg mt-6"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>

    </>
  )
}

