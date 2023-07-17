import { Avatar, Button, Dropdown, MenuProps, Alert } from "antd"
import { User, defaultWrapper, Status } from "../lib/wrapper/pastebin"
import styles from "../styles/Bar.module.css"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"

const profileItems: MenuProps["items"] = [
    {
        key: "1",
        label: (
            <Link rel="noopener noreferrer" href="/profile">
                Profile
            </Link>
        ),
    },
    {
        key: "2",
        label: (
            <Link rel="noopener noreferrer" href="/browse/owned">
                My pastes
            </Link>
        ),
    },
    {
        type: "divider",
    },
    {
        key: "3",
        danger: true,
        label: (
            <a
                onClick={async () => {
                    await defaultWrapper.logout()
                    window.location.reload()
                }}
            >
                Logout
            </a>
        ),
    },
]

export default function MenuBar({ profile }: { profile?: User | undefined }) {

    // backend is up until otherwise proven (so by default status=true)
    const [backendUp, setBackendUp] = useState<boolean>(true)

    async function testBackendConnection() {
        // Make sure to check the returned json and not status code, because
        // status code is sent first and we want to be sure that the request is
        // completely filled
        const resp = await defaultWrapper.checkApi()
        if (resp)
           return setBackendUp(resp.status === "up")
        return setBackendUp(false)
    }
    
    useEffect(()=> {
        setInterval(() => testBackendConnection(), 5_000)
    }, [])

    return (
        <div>
            <div>
                {/* TODO: Set these in env variables */}
                {/* <Alert message="Use old pastebin at https://html.pastebin.fi" banner /> */}
                { backendUp ? null : <Alert type="error" message="Connection to API failed" banner /> }
            </div>
            <div className={styles.bar}>
                <Link className={styles.logo} href="/">
                    pastebin.fi
                </Link>
                <div className={styles["menu-items"]}>
                    <Link href="/browse">Browse</Link>

                    {profile ? (
                        <Dropdown menu={{ items: profileItems }} placement="bottomRight">
                            <Avatar style={{ background: "green" }} shape="circle">
                                {profile.username[0]}
                            </Avatar>
                        </Dropdown>
                    ) : (
                        <Link className={styles.loginLink} href="/auth">
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
