import { useEffect, useState } from "react"
import { Login, Register } from "../../components/AuthPage"
import { defaultWrapper } from "../../lib/wrapper/pastebin"

export async function redirectIfLoggedIn() {
    const profile = await defaultWrapper.getProfile()
    if (profile) window.location.assign("/")
}

export default function Auth() {
    useEffect(() => {
        window.location.assign("/auth/login")
    }, [])
}
