"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = () => {
    if (email.trim()) {
      setIsSubmitted(true)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md relative">
          {/* Cloud Icon */}
          <div className="absolute -right-4 top-8">
            <div className="relative">
              <div className="w-24 h-24 bg-teal-400 rounded-full opacity-80"></div>
              <div className="w-20 h-20 bg-teal-400 rounded-full absolute -top-4 -left-4 opacity-90"></div>
              <div className="w-16 h-16 bg-teal-500 rounded-full absolute top-2 left-2 opacity-100"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 border border-white rounded-full relative">
                    <div className="absolute -top-1 -right-1 w-2 h-2 border border-white rounded-full"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900">Check your email</h1>

            <div className="space-y-3">
              <p className="text-gray-600">We've sent a password reset link to</p>
              <p className="font-medium text-gray-900">{email}</p>
              <p className="text-sm text-gray-500">Didn't receive the email? Check your spam folder or try again.</p>
            </div>

            <div className="space-y-3">
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
                Try another email
              </Button>

              <Link href="/login">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md relative">
        {/* Cloud Icon */}
        
        <div className="absolute -right-4 top-8">
          <div className="relative">
            {/*
            <div className="w-24 h-24 bg-teal-400 rounded-full opacity-80"></div>
            <div className="w-20 h-20 bg-teal-400 rounded-full absolute -top-4 -left-4 opacity-90"></div>
            <div className="w-16 h-16 bg-teal-500 rounded-full absolute top-2 left-2 opacity-100"></div>*/}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 border border-white rounded-full relative">
                 {/* <div className="absolute -top-1 -right-1 w-2 h-2 border border-white rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border border-white rounded-full"></div>*/}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-600 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 bg-gray-50 border-gray-200"
              />
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!email.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send Reset Link
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
