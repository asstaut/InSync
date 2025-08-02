import {jwtDecode} from "jwt-decode"

type DecodedToken = {
  userID: string
  email: string
  role: string
  exp: number
  iat: number
}

export function getUserIDFromToken(): string | null {
  const token = localStorage.getItem("token")
  if (!token) return null

  try {
    const decoded: DecodedToken = jwtDecode(token)
    return decoded.userID
  } catch (error) {
    console.error("Failed to decode token", error)
    return null
  }
}
