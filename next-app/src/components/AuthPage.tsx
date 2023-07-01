import { Form, Input, Button, Checkbox, Space, message } from "antd"
import styles from "../styles/Auth.module.css"
import { defaultWrapper } from "../lib/wrapper/pastebin"
import { useEffect, useState } from "react"
import Link from "next/link"

interface RegistrationState {
    success: boolean
}

function Register() {
    const [registrationResult, setRegistrationResult] = useState<RegistrationState>()
    const [messageApi, contextHolder] = message.useMessage()

    async function onRegister(values: any) {
        const result = await defaultWrapper.register({
            username: values.username,
            email: values.email,
            password: values.password,
        })

        if (!result) {
            setRegistrationResult({ success: false })
            return
        }

        const loginresult = await defaultWrapper.login({
            username: values.username,
            password: values.password,
        })

        if (!loginresult) setRegistrationResult({ success: false })
        else setRegistrationResult({ success: true })
    }

    useEffect(() => {
        if (registrationResult?.success) {
            window.location.assign("/")
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

    async function onLogin(values: any) {
        const result = await defaultWrapper.login({
            username: values.username,
            password: values.password,
        })

        if (!result) setLoginResult({ success: false })
        else setLoginResult({ success: true })
    }

    useEffect(() => {
        if (loginResult?.success) {
            window.location.replace("/")
        } else if (loginResult && !loginResult.success) {
            messageApi.open({
                type: "error",
                content: "Login failed (invalid credinteals)",
            })
        }
    }, [loginResult])

    return (
        <>
            {contextHolder}
            <div className="maxwidth">
                <div className={styles.header}>
                    <h2>Login to your pastebin.fi account</h2>
                    <p>Get access to exclusive features, larger file uploads and more</p>
                </div>
                <Form onFinish={onLogin} layout="vertical" initialValues={{ remember: true }}>
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
                                <Link href="/auth/register">I don't have an account</Link>
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>
            </div>
        </>
    )
}

export { Login, Register }
