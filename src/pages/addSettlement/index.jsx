import React, { useState } from 'react';
import { Button, Form, Input, Flex, Popover, Layout, Cascader, Upload, Space, Modal, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { contentStyle, headerStyle, layoutStyle, footerStyle, titleStyle, projectData } from './static'

const { TextArea } = Input;
const { Header, Footer, Content } = Layout;
const regex = /^\d{6}-\d{15}$/;
import { pathServer } from '../../common'

const App = () => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoding] = useState(false);
    const [form] = Form.useForm();
    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList)
    }
    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                上传收款码
            </div>
        </button>
    );
    const onFinish = async (values) => {
        console.log('values', values)
        const settlementMsg = { ...values, payment_picture: values.payment_picture.file.response.fileurl, isPay: '0', add_time: Date.now() }
        setLoding(true)
        fetch(`${pathServer}/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settlementMsg)
        }).then(response => response.json())
            .then(res => {
                if (res.success) {
                    Modal.success({
                        content: res.msg
                    })
                    setLoding(false)
                    form.resetFields()
                    setFileList([])
                } else {
                    Modal.error({
                        content: res.msg
                    })
                    setLoding(false)
                }
            })
            .catch(error => Modal.error({
                content: error
            }));
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Flex gap="middle" wrap >
                <Layout style={layoutStyle}>
                    <Header style={headerStyle}>
                        <div style={titleStyle}>icon订单结算</div>
                    </Header>
                    <Alert message="7月29日之后完成的单子填这里，文档填过的不用再填，团长微信：SKY-777A，每周日周一结算" type="info" />
                    <Alert message="光遇普陪：2.5元/小时 光遇三恋陪：6元/小时 王者技术陪：1.5元一把 王者娱乐陪：0.8元一把 蛋仔技术陪：4元/小时 蛋仔普陪：2元/小时" type="success" />
                    <Content style={contentStyle}>
                        <Form
                            name="basic"
                            style={{
                                maxWidth: 400,
                                margin: '0 auto'
                            }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            form={form}
                        >
                            <Form.Item
                                label="订单号"
                                name="order_id"
                                tooltip={`举例：240708-281388019343317`}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入正确的订单号',
                                        pattern: regex
                                    }
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="微信号"
                                name="wx_number"
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入你的微信号',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                label="实际陪玩项目与时间"
                                name="project"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择你需要结算的陪玩项目',
                                    },
                                ]}
                            >
                                <Cascader
                                    options={projectData}
                                />
                            </Form.Item>
                                <Form.Item
                                    label="报酬"
                                    name="price"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请输入对应报酬(数字)',
                                            pattern: /^\d{1,3}.\d{1,2}$/
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            <Form.Item
                                label="收款码"
                                name="payment_picture"
                                rules={[
                                    {
                                        required: true,
                                        message: '请上传收款码',
                                    },
                                ]}
                            >
                                <Upload
                                    accept='image/*'
                                    action={`${pathServer}/upload`}
                                    listType="picture-circle"
                                    fileList={fileList}
                                    onChange={handleChange}
                                    maxCount={1}
                                    name='paymentCode'
                                // beforeUpload={beforeUpload}
                                >
                                    {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                label="详情"
                                name="detail"
                                rules={[
                                    {
                                        required: false,
                                        message: '请输入详情',
                                    },
                                ]}
                            >
                                <TextArea rows={4} />
                            </Form.Item>
                            <Form.Item
                                label="备注"
                                name="remark"
                                rules={[
                                    {
                                        required: false,
                                        message: '请输入备注',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Space>
                                    <Button type="primary" htmlType="submit" loading={loading}>
                                        提交结算
                                    </Button>
                                    <Button type="dashed" htmlType="reset">
                                        重置
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Content>
                    <Footer style={footerStyle}>Footer</Footer>
                </Layout>
            </Flex>

        </>

    );

}
export default App;