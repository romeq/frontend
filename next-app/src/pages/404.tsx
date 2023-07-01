import { Button, Result } from "antd"
import Link from "next/link"

export default function Page() {
    return (
        <div className="maxwidth center">
            <h1>404</h1>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Button type="primary">
                        <Link href="/">Back Home</Link>
                    </Button>
                }
            />
        </div>
    )
}
