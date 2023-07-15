import { ConfigProvider } from "antd"
import "../styles/globals.css"
import type { AppProps } from "next/app"
import MenuBar from "../components/MenuBar"
import styles from "../styles/Home.module.css"
import { useEffect, useState } from "react"
import { User, defaultWrapper } from "../lib/wrapper/pastebin"

export default function MyApp({ Component, pageProps }: AppProps) {
    const [userProfile, setUserProfile] = useState<User>()

    useEffect(() => {
        async function update() {
            const profile = await defaultWrapper.getProfile()
            if (profile) setUserProfile(profile)
        }
        update()
    }, [])

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#00b96b",
                },
            }}
        >
            <MenuBar profile={userProfile} />
            <div className={styles.container}>
                <Component {...pageProps} />
            </div>
        </ConfigProvider>
    )
}
