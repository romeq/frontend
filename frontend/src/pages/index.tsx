import CreatePaste from "../components/CreatePaste"
import { Col, Row, Statistic, Divider } from "antd"
import { defaultWrapper, Metrics } from "../lib/wrapper/pastebin"
import { useEffect, useState } from "react"

export default function Home() {
    const [metrics, setMetrics] = useState({} as Metrics)

    async function showMetrics() {
        setMetrics(await defaultWrapper.getMetrics())
    }

    useEffect(()=>{
        showMetrics()
    }, [])

    return (
        <div>
            <CreatePaste />
            <div className="maxwidth" style={{ marginBottom: 70 }}>
                {/* TODO: move to own component */}
                <Divider />
                <Row gutter={16}>
                    <Col span={12}>
                        <Statistic title="Public pastes" groupSeparator=" " value={metrics.pasteCount?.public} />
                    </Col>
                    <Col span={12}>
                        <Statistic title="Private pastes" groupSeparator=" " value={metrics.pasteCount?.private} />
                    </Col>
                </Row>
            </div>
        </div>
    )
}
