import React, { useState, useEffect } from 'react';
import {
    Table, Tag, Image, Button, message, Layout, Row, Col, Space,
    Spin, Input, Modal, InputNumber, Form, Pagination, Select, Divider,
    Flex, Popover
} from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
const { Header, Content } = Layout;
import { headerStyle, contentStyle, layoutStyle } from './static';
import { pathServer } from '../../common'
import clipboardCopy from 'clipboard-copy';
/** 创建接单凭证 */


const app = () => {
    const [loading, setLoading] = useState(false); //页面loading
    const [newToken, setNewToken] = useState(); //页面loading
    const [form] = Form.useForm();
    const createToken = async (param) => {
        // jCOUmJ4ehI-hJWKbe
        // cu0Jc9PXA7-eCYHzE
        setLoading(true)
        try {
            const queryString = new URLSearchParams(param).toString();
            const response = await fetch(`${pathServer}/create_get_order_token?${queryString}`)
            const res = await response.json()
            if (res.success) {
                console.log(res, res.get_order_token)
                setNewToken(res.get_order_token)
                setLoading(false)
            }
            // setLoading(false)
        } catch (error) {
            setLoading(false)
            message.error(error)
        }
    }

    const onFinish = () => {
        const param = form.getFieldsValue(true)
        createToken(param)
    }

    const handleCopy = (text) => {
        clipboardCopy(text)
            .then(() => message.success('信息复制成功 进群对接即可'))
            .catch(err => console.error('复制失败', err));
    };

    const generate = () => {
        onFinish()
    }
    return (
        <>
            <Layout style={layoutStyle}>
                {/* <Header style={headerStyle}>
                </Header> */}
                <Spin spinning={loading}>
                    <Content style={contentStyle}>
                        <Row gutter={5}>
                            <Form
                                name="basic"
                                form={form}
                                onFinish={onFinish}
                                onFinishFailed={() => { }}
                                autoComplete="off"
                            >
                                <Col span={12}>
                                    <Form.Item
                                        label="qq"
                                        name="work_qq"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入正确的qq',
                                            }
                                        ]}
                                        // wrapperCol={{
                                        //     span: 21,
                                        // }}
                                        style={{ margin: '0 auto' }}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        label="微信"
                                        name="work_wx"
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入正确的qq',
                                            }
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={4}> <Button type="primary" onClick={() => { generate() }}>生成凭证</Button></Col>
                            </Form>
                        </Row>
                        <div>
                                        {newToken}
                        </div>
                        {/* <Button type="primary" onClick={() => { generate(modalData) }}>生成</Button> */}
                        <Button type="primary" onClick={() => { handleCopy(newToken) }}>一键复制</Button>
                    </Content>
                </Spin>
            </Layout>
        </>
    )
}

export default app