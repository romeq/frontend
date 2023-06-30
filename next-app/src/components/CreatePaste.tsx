import { Button, Checkbox, Form, Input, Space, message } from "antd"
import { CSSProperties } from "react"
import { defaultWrapper } from "../lib/wrapper/pastebin"

export default function CreatePaste() {
    const [messageApi, contextHolder] = message.useMessage({
        top: 0,
    })

    async function createPaste({
        title,
        paste,
        privatePaste,
    }: {
        title: string
        paste: string
        privatePaste: boolean
    }) {
        if (!title) return messageApi.open({ type: "error", content: "Title is required" })
        if (!paste) return messageApi.open({ type: "error", content: "Paste is required" })

        const key = "creating-paste"
        messageApi.open({ key, type: "loading", content: "Creating paste..." })

        const result = await defaultWrapper.createPaste({ title, paste, private: privatePaste })

        if (result) {
            messageApi.open({ key, type: "success", content: "Paste was created! Redirecting..." })
            setTimeout(() => window.location.assign(`/p/${result.id}`), 500)
        } else messageApi.open({ key, type: "error", content: `Creation failed: ERR400` })
    }

    return (
        <>
            {contextHolder}
            <div className="maxwidth" style={{ marginTop: 80 }}>
                <h1>Create a paste</h1>
                <Form onFinish={createPaste} layout="vertical">
                    <Form.Item label="Title" name="title">
                        <Input placeholder="Name..." />
                    </Form.Item>

                    <Form.Item label="Paste" name="paste">
                        <Input.TextArea
                            placeholder="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In dapibus dui hac nostra mattis aptent lorem. Auctor nec nullam justo purus aptent placerat sociosqu. Hendrerit odio adipiscing nam magna maecenas purus varius. Dictumst torquent venenatis non conubia aenean commodo eu. Ante in condimentum conubia arcu diam blandit fusce. Laoreet venenatis porta cubilia elit mus molestie potenti. Consectetur curabitur molestie eget fermentum consectetur amet fermentum. Lorem blandit proin proin odio nostra nisl eleifend."
                            rows={15}
                        />
                    </Form.Item>

                    <Form.Item name="privatePaste">
                        <Checkbox>Create as private paste</Checkbox>
                    </Form.Item>

                    <Space wrap>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Space>
                </Form>
            </div>
        </>
    )
}
