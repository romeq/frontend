import { Avatar, Button, Dropdown, MenuProps } from "antd"
import { User, defaultWrapper } from "../lib/wrapper/pastebin"
import styles from "../styles/Bar.module.css"
import Link from "next/link"

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
    return (
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
    )
}
