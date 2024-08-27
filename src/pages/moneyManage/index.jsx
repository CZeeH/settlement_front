import React, { useState } from 'react';
import { Flex, Layout, DatePicker, Form, Button, Col, Row, message, InputNumber } from 'antd';
import { pathServer } from '../../common'
import Pie from './pie'
import { value } from 'lodash-es';
const { Header, Footer, Sider, Content } = Layout;

const { RangePicker } = DatePicker;
const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    padding: 10,
    lineHeight: '64px',
    backgroundColor: '#fff',
    width: '100%',
};
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    // color: '#fff',
    backgroundColor: '#fff',
};
const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#1677ff',
};
const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#4096ff',
};
const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
    //   maxWidth: 'calc(50% - 8px)',
};

const rowStyle = {
    width: '100%'
}

const App = () => {
    const [loading, setLoading] = useState(false);
    const [listData, setListData] = useState([
        { type: '分类一', value: 27 },
        { type: '分类二', value: 25 },
        { type: '分类三', value: 18 },
        { type: '分类四', value: 15 },
        { type: '分类五', value: 10 },
        { type: '其他', value: 5 },
      ]);
    /**获取数据 */
    const getData = async (filter, updateDoc, cbFun = () => { }) => {
        setLoading(true)
        fetch(`${pathServer}/count_price`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filter, updateDoc })
        })
            .then(response => response.json())
            .then(res => {
                if (res.success) {
                    console.log(res)
                    message.success(res.msg)
                    cbFun(res.data)
                } else {
                    console.log(res)
                    message.error(res.msg)
                }
            })
            .catch(error => {
                message.error('接单失败，请联系管理员')
                Modal.error({
                    content: error
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }
    const onFinish = (values) => {
        let startDate = new Date(values.timeRange[0])
        let endDate = new Date(values.timeRange[1])
        // console.log(startDate,endDate)
        getData({ startDate, endDate }, {}, (data) => {
            console.log(data)
            const {total_price,total_num } = data[0]
            const {income,advertise,refund} = values
            const getMoney = (Number(income) - Number(total_price) - Number(advertise) - Number(refund) - 3600).toFixed(2)
            const item = [
                { type: '陪玩工资', value: total_price },
                { type: '广告费', value: advertise },
                { type: '退款', value: refund },
                { type: '客服工资', value: 3600 },
                { type: '利润', value: Number(getMoney) },
              ]
            setListData(item)
        })
    }
    const onFinishFailed = () => {

    }

    return (
        // <Flex gap="middle" wrap>
        <Layout style={layoutStyle}>
            <Layout>
                <Header style={headerStyle}>
                    <Form
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Row style={rowStyle} gutter={10}>
                            <Col span={6}>
                                <Form.Item
                                    label="timeRange"
                                    name="timeRange"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your timeRange!',
                                        },
                                    ]}
                                >
                                    <RangePicker />
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item
                                    label="总流水"
                                    name="income"
                                >
                                    <InputNumber />
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item
                                    label="广告费"
                                    name="advertise"
                                >
                                    <InputNumber />
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item
                                    label="退款"
                                    name="refund"
                                >
                                    <InputNumber />
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <Form.Item
                                    wrapperCol={{
                                        offset: 8,
                                        span: 16,
                                    }}
                                >
                                    <Button type="primary" htmlType="submit">
                                        搜索
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Header>
                <Content style={contentStyle}>
                    {Pie(listData)}
                    {/* <div><Pie pData={listData} /></div> */}
                </Content>
                <Footer style={footerStyle}>Footer</Footer>
            </Layout>
        </Layout>
        // </Flex>
    )
}

export default App;