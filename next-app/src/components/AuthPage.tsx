import { Form, Input, Button, Checkbox, Space, message, Modal } from "antd"
import styles from "../styles/Auth.module.css"
import { defaultWrapper } from "../lib/wrapper/pastebin"
import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"

interface RegistrationState {
    success: boolean
    errorCause: string
    username: string
}

const key = `mio${Math.random()}`

function Register() {
    const [registrationResult, setRegistrationResult] = useState<RegistrationState>()
    const [messageApi, contextHolder] = message.useMessage()

    async function onRegister(values: any) {
        messageApi.open({ key, content: "Creating account", type: "loading", duration: 1000 })
        const result = await defaultWrapper.register({
            username: values.username,
            email: values.email,
            password: values.password,
        })

        if (!result)
            setRegistrationResult({
                success: false,
                errorCause: "Registration failed: ERR_R1",
                username: values.username,
            })
        else setRegistrationResult({ success: true, errorCause: "", username: values.username })
    }

    useEffect(() => {
        if (registrationResult?.success) {
            messageApi.open({ key, content: "Renavigating to login...", type: "success" })
            window.location.assign("/auth/login#" + registrationResult.username)
        } else if (registrationResult && !registrationResult.success) {
            messageApi.open({ key, content: registrationResult.errorCause, type: "error" })
        }
    }, [registrationResult])

    return (
        <>
            {contextHolder}
            <div className="maxwidth">
                <div className={styles.header}>
                    <h2>Register to pastebin.fi</h2>
                    <p>Create a new account and get access to exclusive features</p>
                </div>
                <Form onFinish={onRegister} layout="vertical" initialValues={{ remember: true }}>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Username is invalid",
                                pattern: /^[a-z]{1}[a-z_0-9-]{0,18}[a-z]{1}$/,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email address"
                        name="email"
                        rules={[{ type: "email", required: true, message: "Email is required" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Password is required", min: 8 }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Space wrap>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                        <Form.Item>
                            <Button>
                                <Link href="/auth/login">I already have an account</Link>
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>
            </div>
        </>
    )
}

interface LoginState {
    success: boolean
}

function Login() {
    const [loginResult, setLoginResult] = useState<LoginState>()
    const [messageApi, contextHolder] = message.useMessage()
    const [initialUsername, setInitialUsername] = useState<string>()

    async function onLogin(values: any) {
        messageApi.open({
            key: "login",
            type: "loading",
            content: "Logging in...",
        })

        const [result, errCode] = await defaultWrapper.login({
            username: values.username,
            password: values.password,
        })

        if (errCode === "not_activated") {
            setModalOpen(true)
            setInitialUsername(values.username)

            messageApi.open({
                key: "login",
                type: "info",
                content: "In order to login you are required to first verify your email address. Please do it below.",
            })
            return
        }

        if (!result) setLoginResult({ success: false })
        else setLoginResult({ success: true })
    }

    useEffect(() => {
        if (loginResult?.success) {
            window.location.replace("/")
        } else if (loginResult && !loginResult.success) {
            messageApi.open({
                type: "error",
                key: "login",
                content: "Login failed (invalid credinteals)",
            })
        }
    }, [loginResult])

    const [modalopen, setModalOpen] = useState(false)
    const [verificationKey, setVerificationKey] = useState("")
    const [verificationInProgress, setVerificationInProgress] = useState(false)

    useEffect(() => {
        const initialUsername = window.location.hash.slice(1)
        if (initialUsername.length > 20 || initialUsername.length < 2) setInitialUsername("")
        setInitialUsername(initialUsername)
    }, [])

    async function verifyAccount() {
        setVerificationInProgress(true)
        const result = await defaultWrapper.verifyAccount(initialUsername, verificationKey)
        setVerificationInProgress(false)

        if (!result)
            return messageApi.open({
                type: "error",
                content: "Verification failed",
            })

        messageApi.open({
            type: "loading",
            content: "Verification succeed. If you are not redirected automatically, press the submit button again.",
        })

        submitRef.current.click()
    }

    const submitRef = useRef<HTMLButtonElement>()

    return (
        <>
            {contextHolder}

            <Modal
                title="Email verification"
                open={modalopen}
                onOk={verifyAccount}
                confirmLoading={verificationInProgress}
                onCancel={() => {
                    setModalOpen(false)
                    messageApi.open({
                        type: "warning",
                        content: "Login requires email validation",
                    })
                }}
            >
                <Input.Password
                    value={verificationKey}
                    onChange={(e) => setVerificationKey(e.target.value)}
                    placeholder="Verification key"
                ></Input.Password>
            </Modal>
            <div className="maxwidth">
                <div className={styles.header}>
                    <h2>Login to your pastebin.fi account</h2>
                    <p>Get access to exclusive features, larger file uploads and more</p>
                </div>

                {initialUsername !== undefined ? (
                    <Form onFinish={onLogin} layout="vertical" initialValues={{ remember: true }}>
                        <Form.Item
                            initialValue={initialUsername}
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Username is invalid",
                                    pattern: /^[a-z]{1}[a-z_0-9-]{0,18}[a-z]{1}$/,
                                },
                            ]}
                        >
                            <Input disabled={initialUsername !== ""} />
                        </Form.Item>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: "Password is required", min: 8 }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item name="remember" valuePropName="checked">
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>

                        <Space wrap>
                            <Form.Item>
                                <Button ref={submitRef} type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form.Item>
                            <Form.Item>
                                <Button>
                                    <Link href="/auth/register">I don't have an account</Link>
                                </Button>
                            </Form.Item>
                        </Space>
                    </Form>
                ) : null}
            </div>
        </>
    )
}

export { Login, Register }
