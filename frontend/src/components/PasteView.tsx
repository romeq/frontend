import { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import { Button, Card, message, Skeleton, Space } from "antd"
import { DownloadOutlined } from '@ant-design/icons';
import { defaultWrapper, Paste } from "../lib/wrapper/pastebin"
// TODO: use syntax highlight small build
import SyntaxHighlighter from 'react-syntax-highlighter';

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

function ViewPaste() {
    const router = useRouter()
    
    const [messageApi, contextHolder] = message.useMessage()

    const [paste, setPaste] = useState({} as Paste)
    const [contentLoaded, setContentLoaded] = useState(false)

    async function openPaste() {
        const result = await defaultWrapper.getPaste({
            id: router.query.slug.toString()
        })

        if (!result)
           return messageApi.open({
                key: "login",
                type: "loading",
                content: "Logging in...",
            })

        setPaste(result)
        setContentLoaded(true)
    }

    useEffect(()=>{
        if(!router.isReady) return

        openPaste()
    }, [router.isReady])

    return (
        <div className="maxwidth center">
            <Card title={paste.title} extra={
                <Space wrap>
                    <a href="#">Raw</a>
                    <Button type="primary" icon={<DownloadOutlined />} shape="round" size="small">
                        Download ({ paste.content ? formatBytes(paste.content.length) : "empty"})
                    </Button>
                </Space>
            } style={{ width: "120%", backgroundColor: "#f0f0f0" }}>
                {
                    contentLoaded ? 
                        <SyntaxHighlighter language={paste.lang}>
                            {paste.content}
                        </SyntaxHighlighter> 
                    : <Skeleton paragraph={{ rows: 6 }} />
                }
            </Card>
        </div>
    )
}

export { ViewPaste }
