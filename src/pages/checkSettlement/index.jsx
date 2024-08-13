import React, { useState, useEffect } from 'react';
import {
    Table, Tag, Image, Button, message, Layout, Row, Col, Space,
    Spin, Input, Form, Pagination, Select, Divider,
    Flex, Popover, Alert
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { headerStyle, contentStyle, layoutStyle, headerRowStyle } from './static';
const { Header, Content } = Layout;
import { pathServer } from '../../common'

const OrderTable = () => {
    const [data, setData] = useState([]);// 页面数据
    const [loading, setLoading] = useState(false); //页面loading
    const [pageTotals, setPageTotals] = useState(10);
    const [pageCurrent, setPageCurrent] = useState(1);
    const [formTable] = Form.useForm();
    useEffect(() => {
        if (location.hash === '#/check_settlement') {
            getData()
        }
    }, []); // 仅在 count 发生变化时执行
    // 复制通知
    const info = () => {
        message.success('复制成功')
    }
    const onPageChange = (page, pageSize) => {
        setPageCurrent(page)
        getData(formTable.getFieldsValue(true), (page - 1) * pageSize, pageSize)
    };

    /**请求列表数据 */
    const getData = (query, skip = 0, limit = 10) => {
        setLoading(true)
        let params = {
            skip,
            limit
        };
        if (query !== undefined) {
            params = { ...query, ...params }
        }
        // 构建查询字符串
        const queryString = new URLSearchParams(params).toString();
        fetch(`${pathServer}/ordertable_search?${queryString}`)
            .then(response => response.json())
            .then(res => {
                setData(res.data)
                setPageTotals(res.total)
                setLoading(false)
            })
            .catch(error => {
                setLoading(false)
                console.error('获取失败', error)
                message.error(error)
            });
    }

    const onFinishFailed = (error) => {
        console.log(error)
    }
    const columns = [
        {
            title: '订单号（点击可复制）',
            dataIndex: 'order_id',
            key: 'order_id',
            render: (v, record) => (
                <div className='m-0'>
                    <CopyToClipboard text={v} onCopy={info}>
                        <Button type="text">{v}</Button>
                    </CopyToClipboard>

                </div>
            )
        },
        {
            title: '项目/价格',
            dataIndex: 'project',
            key: 'project',
            width: 260,
            render: (v, record) => (
                <Flex justify={'center'} align={'center'} gap="small" wrap>
                    <Tag color="magenta">{v}</Tag>
                    <Tag color="red">{record.price}元</Tag>
                </Flex>
            )
        },
        {
            title: '是否结算 / 微信号',
            dataIndex: 'isPay',
            key: 'isPay',
            width: 150,
            render: (v, record) => (
                v === '1' ? (
                    <Flex justify={'center'} align={'center'} gap="small" wrap>
                        <CopyToClipboard text={record.wx_number} onCopy={info}>
                            <Tag color="blue">{record.wx_number}</Tag>
                        </CopyToClipboard>
                        <Tag color="success">已结算</Tag>
                        <div />
                        <Tag color="success">结算时间：{record.settlementTime}</Tag>
                    </Flex>
                )
                    :
                    (
                        <Flex justify={'center'} align={'center'} gap="small" vertical>
                            <CopyToClipboard text={record.wx_number} onCopy={info}>
                                <Tag.CheckableTag color="blue">{record.wx_number}</Tag.CheckableTag>
                            </CopyToClipboard>
                            <Popover placement="right" content={() => (
                                <Image
                                    width={300}
                                    height={405}
                                    src={record.payment_picture}
                                />
                            )} >
                                <Button type="primary">
                                    收款码
                                </Button>
                            </Popover>

                        </Flex>
                    )
            )
        },
        {
            title: '备注',
            dataIndex: 'remark',
            key: 'remark',
        },
    ];

    const search = () => {
        const values = formTable.getFieldsValue(true)
        setPageCurrent(1)
        getData(values)
    }

    const resetParam = () => {
        formTable.resetFields()
        setPageCurrent(1)
        getData()
    }

    return (
        <Layout style={layoutStyle}>
            <Header style={headerStyle}>
                <Form
                    name="search"
                    onFinish={search}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    style={headerRowStyle}
                    form={formTable}
                >
                    <Row gutter={10}>
                        <Col span={7}>
                            <Form.Item
                                label="订单号"
                                name="order_id"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please input order_id!',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Form.Item
                                label="结算状态"
                                name="isPay"
                            >
                                <Select
                                    defaultValue={undefined}
                                    style={{ width: 120 }}
                                    options={[
                                        { value: '1', label: '已结算' },
                                        { value: '0', label: '未结算' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                label="微信号"
                                name="wx_number"
                                rules={[
                                    {
                                        required: false,
                                        message: 'Please input 微信号',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Space>
                                <Button key="submit" type="primary" loading={loading} onClick={search}>
                                    搜索
                                </Button>
                                <Button key="reset" type="default" loading={loading} onClick={resetParam}>
                                    重置
                                </Button>
                            </Space>
                        </Col>
                    </Row>

                </Form>

                <Divider />
            </Header>
            <Spin spinning={loading}>
            <Alert message="提高收入技巧：订单开始前，提醒陪陪 输非mvp【主动】联系老板上号减少80%退款率！" type="success" />
            <Divider />
                <Content style={contentStyle}>

                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey={record => record.order_id}
                        pagination={false}
                        showHeader
                        bordered
                    />
                    <Pagination
                        align="center"
                        defaultCurrent={1}
                        total={pageTotals}
                        current={pageCurrent}
                        onChange={onPageChange}
                    />
                </Content>
            </Spin>
        </Layout>
    );
};

export default OrderTable