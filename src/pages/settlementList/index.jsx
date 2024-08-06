import React, { useState, useEffect } from 'react';
import {
    Table, Tag, Image, Button, message, Layout, Row, Col, Space,
    Spin, Input, Modal, InputNumber, Form, Pagination, Select, Divider,
    Flex, Popover, FloatButton
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { headerStyle, contentStyle, layoutStyle, headerRowStyle } from './static';
const { Header, Content } = Layout;
import { pathServer } from '../../common'
import Big from 'big.js'

const OrderTable = () => {
    const [data, setData] = useState([]);// 页面数据
    const [loading, setLoading] = useState(false); //页面loading
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [open, setOpen] = useState(false); // modal 开关
    const [modalValues, seModalValues] = useState({}); // modal 开关
    const [pageTotals, setPageTotals] = useState(10);
    const [pageCurrent, setPageCurrent] = useState(1);
    const [batchPrice, setBatchPrice] = useState(0); // 批量结算总金额

    const [form] = Form.useForm();
    const [formTable] = Form.useForm();
    useEffect(() => {
        getData()
    }, []); // 仅在 count 发生变化时执行
    // 复制通知
    const info = () => {
        message.success('复制成功')
    }
    const showModal = (value) => {
        setOpen(true);
        seModalValues(value)
    };
    const handleCancel = () => {
        form.resetFields()
        setOpen(false);
    };
    const onPageChange = (page, pageSize) => {
        setPageCurrent(page)
        getData(formTable.getFieldsValue(true), (page - 1) * pageSize, pageSize)
    };

    const onSelectChange = (newSelectedRowKeys, records) => {
        let sum = new Big('0')
        let newKeys = []
        records.forEach(element => {
            if (element.isPay === '0') {
                sum = sum.plus(new Big(element.price))
                console.log(sum)
                newKeys.push(element.order_id)
            }
        });
        setSelectedRowKeys(newKeys);
        setBatchPrice(sum.toFixed(2))
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;

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
    
    /**更新数据 */
    const deleteFetch = async (order_id) => {
        setLoading(true)
        const params = {
            order_id
        };
        // 构建查询字符串
        const queryString = new URLSearchParams(params).toString();
        fetch(`${pathServer}/delete_record?${queryString}`).then(response => response.json())
            .then(res => {
                res.success ? message.success(res.msg) : message.error(res.msg)
                res.success && getData({}, pageCurrent)
            })
            .catch(error => {
                setLoading(false)
                console.error('获取失败', error)
                message.error(error)
            });

    }
    /**更新数据 */
    const updateFetch = async (filter, updateDoc, cbFun = () => { }) => {
        setLoading(true)
        fetch(`${pathServer}/update_payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filter, updateDoc })
        })
            .then(response => response.json())
            .then(res => {
                if (res.success) {
                    message.success('结算成功')
                    getData(formTable.getFieldsValue(true), pageCurrent)
                } else {
                    message.error('结算失败，请检查')
                    setLoading(false)
                }
            })
            .catch(error => Modal.error({
                content: error
            }))
            .finally(() => {
                cbFun()
            })
    }
    /**批量更新 */
    const batchUpdateFetch = async (filter, updateDoc, cbFun = () => { }) => {
        setLoading(true)
        fetch(`${pathServer}/batch_update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filter, updateDoc })
        })
            .then(response => response.json())
            .then(res => {
                if (res.success) {
                    message.success('批量结算成功')
                    getData(formTable.getFieldsValue(true), pageCurrent)
                    setSelectedRowKeys([])
                    setBatchPrice(0)
                } else {
                    message.error('批量结算失败，请检查')
                    setLoading(false)
                }
            })
            .catch(error => Modal.error({
                content: error
            }))
            .finally(() => {
                cbFun()
            })
    }
    /**更新结算状态 */
    const settlement = async (record) => {
        // 格式化时间为字符串，可以根据需要调整格式
        updateFetch({ order_id: record.order_id }, { isPay: '1', settlementTime: (new Date()).toLocaleString() })
    };
    /** 删除数据 */
    const deleteRecord = (record) => {
        deleteFetch(record.order_id)
    }

    const onFinishFailed = (error) => {
        console.log(error)
    }
    /**modal中结算 */
    const setCommentAndSettlement = () => {
        const values = form.getFieldsValue(true)
        updateFetch(
            { order_id: values.order_id },
            {
                isPay: '1',
                settlementTime: (new Date()).toLocaleString(),
                price: values.price,
                remark: values.remark
            },
            handleCancel
        )
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
                                <Button type="primary" onClick={() => settlement(record)}>
                                    结算
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
        {
            title: '操作',
            dataIndex: 'actions',
            key: 'actions',
            render: (_, record) => (
                <Button.Group>
                    <Popover content={record.detail} title='详情'>
                        <Button type="primary">详情</Button>
                    </Popover>
                    <Button type="primary" onClick={() => showModal(record)}>结算并备注</Button>
                    <Button type="primary" onClick={() => deleteRecord(record)}>删除</Button>
                </Button.Group>
            ),
        },
    ];

    const search = () => {
        const values = formTable.getFieldsValue(true)
        setSelectedRowKeys([])
        setBatchPrice(0)
        setPageCurrent(1)
        getData(values)
    }

    const resetParam = () => {
        formTable.resetFields()
        setSelectedRowKeys([])
        setBatchPrice(0)
        setPageCurrent(1)
        getData()
    }

    const batchSettlement = () => {
        const filter = []
        const updateDoc = { isPay: '1', settlementTime: (new Date()).toLocaleString() }
        selectedRowKeys.forEach((selectedRowKey) => {
            filter.push({ order_id: selectedRowKey })
    })
        batchUpdateFetch(filter, updateDoc)
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
                <Content style={contentStyle}>
                    <Flex align="center" gap="small">
                        <Button type="primary" onClick={batchSettlement} disabled={!hasSelected} loading={loading}>
                            批量结算 总金额：{batchPrice}
                        </Button>
                    </Flex>
                    <Table
                        dataSource={data}
                        columns={columns}
                        rowKey={record => record.order_id}
                        pagination={false}
                        showHeader
                        bordered
                        rowSelection={rowSelection}
                    />
                    <Pagination
                        align="center"
                        defaultCurrent={1}
                        total={pageTotals}
                        current={pageCurrent}
                        onChange={onPageChange}

                    />
                </Content>
                <Modal
                    open={open}
                    title="备注与结算"
                    onOk={setCommentAndSettlement}
                    onCancel={handleCancel}
                    footer={[
                        <Button key="back" onClick={handleCancel}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" loading={loading} onClick={setCommentAndSettlement}>
                            完成备注并结算
                        </Button>,
                    ]}
                >
                    <Form
                        name="basic"
                        style={{
                            maxWidth: 400,
                            margin: '0 auto'
                        }}
                        onFinish={setCommentAndSettlement}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        initialValues={modalValues}
                        form={form}
                    >
                        <Form.Item
                            label="订单号"
                            name="order_id"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input order_id!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="报酬"
                            name="price"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input price!',
                                },
                            ]}
                        >
                            <InputNumber />
                        </Form.Item>
                        <Form.Item
                            label="备注"
                            name="remark"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input remark!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Image
                            width={300}
                            height={405}
                            src={modalValues.payment_picture}
                        />
                    </Form>
                </Modal>
            </Spin>
        </Layout>
    );
};

export default OrderTable