import { useEffect } from "react"
import { Register } from "../../components/AuthPage"
import { redirectIfLoggedIn } from "."

export default function LoginPage() {
    useEffect(() => {
        redirectIfLoggedIn()
    }, [])

    return (
        <div className="center">
            <Register />
        </div>
    )
}
