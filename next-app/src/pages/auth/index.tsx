import { useEffect, useState } from "react"
import { Login, Register } from "../../components/AuthPage"
import { defaultWrapper } from "../../lib/wrapper/pastebin"

export default function Auth() {
    useEffect(() => {
        window.location.assign("/auth/login")
    }, [])
}
