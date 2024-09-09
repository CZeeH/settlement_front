import React, { useState,useEffect } from 'react';
import { Button, Form, Input, Flex, message, Layout, Cascader, Upload, Space, Modal, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { contentStyle, headerStyle, layoutStyle, footerStyle, titleStyle, projectData } from './static'

const { TextArea } = Input;
const { Header, Footer, Content } = Layout;
const regex = /^\d{6}-\d{15}$/;
import { pathServer } from '../../common'

const App = () => {
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(true); // 新建弹窗
    const [form] = Form.useForm();
    const [token, setToken] = useState(); // 接单凭证
    const [formToken] = Form.useForm();

    useEffect(() => {
        const get_order_token = localStorage.getItem("icon_take_token");
        if (get_order_token) {
          checkTokenFetch({ get_order_token: get_order_token }, (data) => {
            setToken({ get_order_token, ...data })
            setIsModalOpen(false)
          })
        }
      }, [])

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
        setLoading(true)
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
                    setLoading(false)
                    form.resetFields()
                    setFileList([])
                } else {
                    Modal.error({
                        content: res.msg
                    })
                    setLoading(false)
                }
            })
            .catch(error => Modal.error({
                content: error
            }));
    };
    /** modal完成处理 表格提交 反馈 */
    const handleOk = () => {
        formToken.submit()
    }
    /** modal主动关闭  */
    const handleCancel = () => {
        if (token) {
            setIsModalOpen(false)
        } else {
            message.error('请验证凭证')
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const checkTokenFetch = async (params, cb) => {
        setLoading(true)
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${pathServer}/check_order_token?${queryString}`)
            const res = await response.json()
            if (res.success) {
                cb(res.data[0])
            }
            message.success(res.msg)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            message.error(error)
        }
    }

    const onTokenFinish = () => {
        const get_order_token = formToken.getFieldValue('get_order_token')

        checkTokenFetch({ get_order_token: get_order_token }, (data) => {
            localStorage.setItem("icon_take_token", get_order_token)
            setToken({ get_order_token, ...data })
            setIsModalOpen(false)
        })
    }

    return (
        <>

            <Flex gap="middle" wrap >
                <Layout style={layoutStyle}>
                    <Header style={headerStyle}>
                        <div style={titleStyle}>icon订单结算</div>
                    </Header>
                    <Alert message="团长微信：SKY-777A，一般半个月结算一次，接单多的可以喊团长每周末给你结算" type="info" />
                    <Alert message="光遇普陪：2.5元/小时 光遇三恋陪：6元/小时 王者技术陪：1.7元一把 王者娱乐陪：0.8元一把 蛋仔技术陪：4元/小时 蛋仔普陪：2元/小时" type="success" />
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
                                tooltip={`项目金额多少就是多少`}
                                rules={[
                                    {
                                        required: true,
                                        message: '请输入对应报酬(数字)',
                                        pattern: /^\d+(\.\d{1,2})?$/
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
                            {/* <Form.Item
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
                            </Form.Item> */}
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
            <Modal title="凭证验证"
                open={isModalOpen}
                onOk={() => {
                    handleOk()
                }}
                onCancel={() => {
                    handleCancel()
                }}
                okText='验证凭证'
                cancelText='验证凭证后可抢单'
                clearOnDestroy
                confirmLoading={loading}
            >

                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    // style={{
                    //   maxWidth: 600,
                    // }}
                    form={formToken}
                    onFinish={onTokenFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="接单凭证"
                        name="get_order_token"
                        tooltip="跟客服或者团长77申请"
                        getValueFromEvent={(e) => e.target.value.replace(/(^\s*)|(\s*$)/g, '')}
                        rules={[
                            {
                                required: true,
                                message: '请输入正确的接单凭证',
                                pattern: /^\w{10}-\w{6}$/
                            }
                        ]}
                        wrapperCol={{
                            span: 21,
                        }}
                        style={{ margin: '0 auto' }}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );

}
export default App;