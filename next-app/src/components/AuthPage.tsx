import { Form, Input, Button, Checkbox, Space, message } from "antd"
import styles from "../styles/Auth.module.css"
import { defaultWrapper } from "../lib/wrapper/pastebin"
import { useEffect, useState } from "react"

interface RegistrationState {
    success: boolean
}

function Register(props: { toggleMode: () => void }) {
    const [registrationResult, setRegistrationResult] = useState<RegistrationState>()

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
            window.location.replace("/")
        }
    }, [registrationResult])

    return (
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
                        <Button onClick={props.toggleMode}>I already have an account</Button>
                    </Form.Item>
                </Space>
            </Form>
        </div>
    )
}

interface LoginState {
    success: boolean
}

function Login(props: { toggleMode: () => void }) {
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
                            <Button onClick={props.toggleMode}>I don't have an account</Button>
                        </Form.Item>
                    </Space>
                </Form>
            </div>
        </>
    )
}

export default function AuthPage() {
    const [useLogin, setUseLogin] = useState(false)

    useEffect(() => {
        async function fetchProfile() {
            const profile = await defaultWrapper.getProfile()
            if (!profile) return

            window.location.replace("/")
        }

        fetchProfile()
    }, [])

    return (
        <>
            {useLogin ? (
                <Login toggleMode={() => setUseLogin((prev) => !prev)} />
            ) : (
                <Register toggleMode={() => setUseLogin((prev) => !prev)} />
            )}
        </>
    )
}
