import { useEffect } from "react"
import { Login } from "../../components/AuthPage"
import { redirectIfLoggedIn } from "."

export default function LoginPage() {
    useEffect(() => {
        redirectIfLoggedIn()
    }, [])

    return (
        <div className="center">
            <Login />
        </div>
    )
}
