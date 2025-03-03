'use client'
import { SessionProvider } from "next-auth/react"

export default function AuthProvider({
    children,
}: { children: React.ReactNode }) {
    return (
        <SessionProvider
        >
            {children}
        </SessionProvider> // why don't we wrap the body in sessionProvider?
    )
}