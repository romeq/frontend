import { Collapse, Descriptions, Dropdown, Form, Input, Pagination, Radio, RadioChangeEvent, Space } from "antd"
import { useState } from "react"

interface PasteMetadata {
    uploader?: string
    title: string
    views: number
    size: number
    dateCreated: Date
}

function displayDate(date: Date): string {
    const locale = "de" // todo: get from storage or something like that
    return date.toLocaleString(locale)
}

function Item({ item }: { item: PasteMetadata }) {
    return (
        <>
            <Descriptions size="small" column={4}>
                <Descriptions.Item span={4} label="Uploader">
                    {item.uploader || "TheAnonymousUploader"}
                </Descriptions.Item>
                <Descriptions.Item span={2} label="Upload date">
                    {displayDate(item.dateCreated)}
                </Descriptions.Item>
                <Descriptions.Item label="Views">{item.views}</Descriptions.Item>
                <Descriptions.Item label="Size (bytes)">{item.size}</Descriptions.Item>
            </Descriptions>
        </>
    )
}

function Items({ items }: { items: PasteMetadata[] }) {
    return (
        <Collapse
            expandIconPosition="end"
            style={{ width: "100%", marginBottom: 50 }}
            collapsible="header"
            size="small"
            defaultActiveKey={[]}
            items={items.map((item, index) => {
                return {
                    key: index,
                    label: item.title,
                    children: <Item item={item} />,
                }
            })}
        />
    )
}

export default function BrowsePage() {
    const [sortTypeValue, setToggleSortTypeValue] = useState(1)
    const [sortDirection, setToggleSortDirection] = useState(1)

    const [items, setItems] = useState<PasteMetadata[]>([
        {
            title: "hs.fi - maksumuuri poistettu",
            views: 518,
            size: 25091,
            dateCreated: new Date(Date.now()),
        },
        {
            title: "hs.fi - maksumuuri poistettu",
            views: 0,
            size: 25091,
            dateCreated: new Date(Date.now()),
        },
        {
            title: "hs.fi - maksumuuri poistettu",
            views: 0,
            size: 25091,
            dateCreated: new Date(Date.now()),
        },
        {
            title: "hs.fi - maksumuuri poistettu",
            views: 0,
            size: 25091,
            dateCreated: new Date(Date.now()),
        },
        {
            title: "hs.fi - maksumuuri poistettu",
            views: 0,
            size: 25091,
            dateCreated: new Date(Date.now()),
        },
        {
            title: "hs.fi - maksumuuri poistettu",
            views: 0,
            size: 25091,
            dateCreated: new Date(Date.now()),
        },
        {
            title: "hs.fi - maksumuuri poistettu",
            views: 0,
            size: 25091,
            dateCreated: new Date(Date.now()),
        },
    ])

    const toggleSortType = (e: RadioChangeEvent) => setToggleSortTypeValue(e.target.value)
    const toggleSortDirection = (e: RadioChangeEvent) => setToggleSortDirection(e.target.value)
    return (
        <div className="maxwidth center">
            <Form layout="vertical" style={{ width: "100%", marginTop: 50, marginBottom: 50 }}>
                <Form.Item>
                    <Input.Search placeholder="Matti Nykänen's diary" />
                </Form.Item>

                <Space align="baseline">
                    <Form.Item label="Sort method">
                        <Radio.Group onChange={toggleSortType} value={sortTypeValue}>
                            <Space direction="vertical">
                                <Radio value={1}>Date</Radio>
                                <Radio value={2}>Viewcount</Radio>
                                <Radio value={3}>Paste size</Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="Sort direction">
                        <Radio.Group onChange={toggleSortDirection} value={sortDirection}>
                            <Space direction="vertical">
                                <Radio value={1}>Decreasing</Radio>
                                <Radio value={2}>Increasing</Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                </Space>
            </Form>
            <Items items={items} />

            <Pagination style={{ marginBottom: 50 }} defaultCurrent={1} total={50} />
        </div>
    )
}
