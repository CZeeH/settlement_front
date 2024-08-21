import React, { useState, useEffect } from 'react';
import {
  Space, Table, Tag, Button, Flex, Select, Col, Row, Modal, Form, Cascader,
  Input, Spin, Layout, message, Descriptions, Pagination, Popover
} from 'antd';
import { projectData, order_status, layoutStyle, footerStyle, siderStyle, contentStyle, headerStyle, } from './static'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { pathServer } from '../../common'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import clipboardCopy from 'clipboard-copy';

const { Header, Footer, Sider, Content } = Layout;
const regex = /^\d{6}-\d{15}$/
const info = () => {
  message.success('复制成功')
}


const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 新建弹窗
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 链接复制弹窗
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false); // 凭证弹窗
  const [listData, setlistData] = useState([]); // 页面数据
  const [modalDetail, setModaDetail] = useState([]);  // 链接弹窗里面的数据
  const [copyUrl, setCopyUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageTotals, setPageTotals] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [newToken, setNewToken] = useState(''); //页面loading
  const [form] = Form.useForm();
  const [pageForm] = Form.useForm();
  const [tokenForm] = Form.useForm();

  useEffect(() => {
    getListData()
    const intervalId = setInterval(() => {
      getListData()
    }, 60000); // 60000 毫秒 = 1 分钟
    return () => clearInterval(intervalId);
  }, [])
  const handleCopyClick = (text) => {
    clipboardCopy(text)
      .then(() => message.success('信息复制成功'))
      .catch(err => console.error('复制失败', err));
  }
  const handleCopyDeatil = (data) => {
    const formattedText = `
    【接单后先对接老板】通过联系qq或者王者对接老板，联系不到喊客服
    
    [区服]:${data.origin}\n
    [游戏项目]:${data.project}\n
    [游戏id/名字]:${data.game_id}\n
    [游戏段位]:${data.game_level}\n
    [订单号]:${data.order_id}\n
    [老板备注]:${data.remark}\n
    [老板qq]:${data.qq_number}\n
    
    接单注意事项：非mvp主动联系老板上号代练
    `;

    clipboardCopy(formattedText)
      .then(() => message.success('信息复制成功 扫码进群对接即可'))
      .catch(err => console.error('复制失败', err));
  };

  const updateFetch = async (filter, updateDoc, cbFun = () => { }) => {
    setLoading(true)
    fetch(`${pathServer}/update_order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filter, updateDoc })
    })
      .then(response => response.json())
      .then(res => {
        if (res.success) {
          message.success('匹配成功')
          cbFun()
        } else {
          message.error('匹配失败，请联系管理员')
        }
      })
      .catch(error => {
        message.error('匹配失败，请联系管理员')
        Modal.error({
          content: error
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleFinishAssign = (id) => {
    updateFetch({ order_id: id }, { order_status: order_status.Assigned }, () => { getListData() })
  }

  const getTextColor = (value) => {
    let color = {}
    switch (value) {
      case (order_status.Assigned):
        color = { color: '#82c954' };
        break;
      case (order_status.unAssigned):
        color = { color: '#3875f6' };
        break;
      case (order_status.unSubmitted):
        color = { color: 'red' };
        break;
      default:
        color = { color: 'black' };
    }
    return color
  }
  const columns = [
    {
      // title: '订单号（点击可复制）',
      title: (<>
        订单号
        <Popover content='点击均可复制' title="提示">
          <Tag bordered={false} color="processing" icon={<ExclamationCircleOutlined />}></Tag>
        </Popover>
      </>),
      dataIndex: 'order_id',
      key: 'order_id',
      render: (v, record) => {
        return (
          <>
            <CopyToClipboard text={v} onCopy={info}>
              <Button type="text" style={getTextColor(record.order_status)}>{v}</Button>
            </CopyToClipboard>
            {record.game_id !== undefined && <CopyToClipboard text={record.game_id} onCopy={info}>
              <Button type="text" style={getTextColor(record.order_status)}>游戏id:{record.game_id}</Button>
            </CopyToClipboard>}
          </>

        )
      }
    },
    {
      title: '订单状态',
      dataIndex: 'order_status',
      key: 'order_status',
      render: (v, record) => {
        switch (v) {
          case order_status.unAssigned:
            return (
              <Flex >
                <Tag icon={<SyncOutlined spin />} color="processing">等待分配陪玩</Tag>
                <div style={{ padding: 10 }}>
                  <Tag color="processing" >{record.project}</Tag>
                </div>
              </Flex>
            )
          case order_status.Assigned:
            return (
              <>
                <Tag icon={<CheckCircleOutlined />} color="success">订单分配完毕</Tag>

                {record.work_wx === undefined ? <Tag color="success">{record.project}</Tag> : (
                  <CopyToClipboard text={record.work_wx} onCopy={info}>
                    <Button type="text" style={getTextColor(record.order_status)}>{record.work_wx}</Button>
                  </CopyToClipboard>)
                }

              </>
            )
          default:
            return (
              <>
                <Tag icon={<ClockCircleOutlined spin />} color="default">等待用户填单</Tag>
                <Tag color="default">{record.project}</Tag>
              </>

            )
        }
      }
    },
    {
      title: (<>
        操作
        <Popover content='点击“链接”、“详情”均可复制' title="提示">
          <Tag bordered={false} color="processing" icon={<ExclamationCircleOutlined />}></Tag>
        </Popover>

      </>),
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          {[order_status.unAssigned, order_status.Assigned].includes(record.order_status) && <Button type={
            record.order_status === order_status.unAssigned ? 'primary' : ''
          } onClick={() => { handleCopyDeatil(record) }}>详情</Button>}
          {record.order_status === order_status.unAssigned && (
            <>
              <Button type='primary' onClick={() => { handleFinishAssign(record.order_id) }}>匹配完成</Button>
            </>
          )}
          <Button onClick={() => { handleCopyClick(record.random_url) }}>
            链接
          </Button>
          <Button onClick={() => { handleDelete(record.order_id) }}>删除</Button>
        </Space>
      ),
    },
  ];
  /**modal打开处理 表格加载 数据init 数据刷新 */
  const openModal = () => {
    setIsModalOpen(true)
  }

  /**删除 */
  const handleDelete = async (order_id) => {
    setLoading(true)
    const params = {
      order_id
    };
    // 构建查询字符串
    const queryString = new URLSearchParams(params).toString();
    fetch(`${pathServer}/delete_order?${queryString}`).then(response => response.json())
      .then(res => {
        res.success ? message.success(res.msg) : message.error(res.msg)
        res.success && getListData({}, pageCurrent)
      })
      .catch(error => {
        setLoading(false)
        console.error('删除失败', error)
        message.error(error)
      });

  }

  /** modal完成处理 表格提交 反馈 */
  const handleOk = () => {
    form.submit()
  }
  /** modal主动关闭  */
  const handleCancel = () => {
    setIsModalOpen(false)
  }
  /** 新建订单表格提交 数据收集 数据上传 调用 */
  const onFinish = async (values) => {
    console.log('Success:', values);
    const data = { ...values, add_time: Date.now(), order_status: order_status.unSubmitted }
    creatFetch(data)
  };
  /** 新建订单发起请求 */
  const creatFetch = (data) => {
    setLoading(true)
    fetch(`${pathServer}/create_order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.json())
      .then(res => {
        if (res.success) {
          message.success(res.msg)
          form.resetFields()
          setIsModalOpen(false)
          setLoading(false)
          setIsDetailModalOpen(true)
          const { order_id, random_url, project } = { ...data, ...res }
          console.log('random_url', random_url)
          setCopyUrl(random_url)
          setModaDetail([
            {
              key: 'order_id',
              label: '订单号',
              children: <p>{order_id}</p>,
            },
            {
              key: 'random_url',
              label: '链接',
              children: <p>{random_url}</p>,
            },
            {
              key: 'project',
              label: '游戏项目',
              children: <p>{project}</p>,
            },
          ])

          // 获取列表数据
        } else {
          message.error(res.msg)
          setLoading(false)
        }
      })
      .catch(error => message.error(error));
  }
  /**获取历史数据 */
  const getListData = (query, skip = 0, limit = 10) => {
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
    fetch(`${pathServer}/get_create_orderlist?${queryString}`)
      .then(response => response.json())
      .then(res => {
        setlistData(res.data)
        setPageTotals(res.total)
        setLoading(false)
      })
      .catch(error => {
        setLoading(false)
        console.error('获取失败', error)
        message.error(error)
      });
  }
  /** 新建订单表格提交失败处理 反馈 */
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onPageChange = (page, pageSize) => {
    setPageCurrent(page)
    getListData(form.getFieldsValue(true), (page - 1) * pageSize, pageSize)
  };

  const search = () => {
    const param = pageForm.getFieldsValue(true)
    console.log('param', param, pageTotals)
    getListData(param, (pageCurrent - 1) * 10)
    // message.success('暂未开放')
  }

  const reset = () => {
    pageForm.resetFields()
    getListData()
  }

  const generateRandomString = (length) => {
    const charset = '0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset[randomIndex];
    }
    return randomString;
  }

  const generateRandomOrderId = () => {
    const text = `333333-${generateRandomString(15)}`
    form.setFieldValue('order_id', text)
  }

  const generateToken = () => {
    setIsTokenModalOpen(true)
  }

  const tokenOnFinish = () => {
    const param = form.getFieldsValue(true)
    createToken(param)
  }

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

  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Form
          name="searchPage"
          form={pageForm}
          autoComplete="off"
        >
          <Row gutter={5}>
            <Col xs={12} sm={12} md={12} lg={8} xl={8}>
              <Form.Item
                label="订单号"
                name="order_id"
                rules={[
                  {
                    required: false,
                    message: '请输入正确的订单号',
                    pattern: regex
                  }
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={12} sm={12} md={12} lg={4} xl={4}>
              <Form.Item
                label="订单状态"
                name="order_status"
              >
                <Select
                  defaultValue={undefined}
                  style={{ width: 120 }}
                  options={[
                    { value: '1', label: '等待填单' },
                    { value: '2', label: '等待匹配' },
                    { value: '3', label: '匹配完成' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={6} sm={8} md={4} lg={2} xl={2}><Button type="primary" onClick={() => { search() }}>搜索</Button></Col>
            <Col xs={6} sm={8} md={4} lg={2} xl={2}><Button onClick={() => { reset() }}>重置</Button></Col>
            {/* <Col span={24}></Col> */}
            <Col xs={6} sm={8} md={4} lg={2} xl={2}><Button type="primary" onClick={openModal}>新建</Button></Col>
            <Col xs={6} sm={8} md={4} lg={2} xl={2}> <Button onClick={() => { getListData() }}>刷新</Button></Col>
            <Col xs={6} sm={8} md={4} lg={2} xl={2}> <Button onClick={() => { generateToken() }}>凭证</Button></Col>
          </Row>
        </Form>
      </Header>
      <Content style={contentStyle}>
        <Spin spinning={loading}>


          <Modal title="新建订单"
            open={isModalOpen}
            onOk={() => {
              handleOk()
            }}
            onCancel={() => {
              handleCancel()
            }}
            okText='创建'
            cancelText='取消'
            clearOnDestroy
            confirmLoading={loading}
          >
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              // style={{
              //   maxWidth: 600,
              // }}
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="订单号"
              >
                <Form.Item
                  // label="订单号"
                  name="order_id"
                  rules={[
                    {
                      required: true,
                      message: '请输入正确的订单号',
                      pattern: regex
                    }
                  ]}
                  wrapperCol={{
                    span: 21,
                  }}
                  style={{ margin: '0 auto' }}
                >
                  <Input />
                </Form.Item>
                <Button onClick={() => { generateRandomOrderId() }}>随机创建</Button>
              </Form.Item>


              <Form.Item
                label="项目"
                name="project"
                wrapperCol={{
                  span: 14,
                }}
                rules={[
                  {
                    required: true,
                    message: '请选择游戏项目',
                  },
                ]}
              >
                <Cascader
                  options={projectData}
                />
              </Form.Item>
              {/* <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
            </Form.Item> */}
            </Form>
          </Modal>
          <Modal
            title="订单信息"
            open={isDetailModalOpen}
            onOk={() => {
              setIsDetailModalOpen(false)
              getListData()
            }}
            okText='完成'
            cancelText='取消'
            onCancel={() => { setIsDetailModalOpen(false) }}
            clearOnDestroy
          >
            <Descriptions
              bordered
              title="订单链接与信息"
              size='small'
              extra={<Button type="primary" onClick={() => { handleCopyClick(copyUrl) }}>一键复制链接</Button>}
              items={modalDetail}
            />
          </Modal>
          <Modal
            title="凭证创建"
            open={isTokenModalOpen}
            onOk={() => {
              setIsTokenModalOpen(false)
            }}
            okText='关闭'
            cancelText='取消'
            onCancel={() => { setIsTokenModalOpen(false) }}
            clearOnDestroy
          >
            <Form
              name="basic"
              form={tokenForm}
              onFinish={tokenOnFinish}
              onFinishFailed={() => { }}
              autoComplete="off"
            >
              <Col span={12}>
                <Form.Item
                  label="qq（接单/派单人）"
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
                  label="微信（接单/派单人）"
                  name="work_wx"
                  rules={[
                    {
                      required: true,
                      message: '请输入正确的wx',
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={4}> <Button type="primary" onClick={() => { tokenOnFinish() }}>生成凭证</Button></Col>
              <Col span={4}><Button onClick={() => { handleCopyClick(`
                你的凭证是： ${newToken}\n
                请保存好你的凭证，后续将关联结算哦\n
                接单大厅地址：http://47.99.132.17:3889/#/take_order  \n
                【进入接单大厅后，输入凭证即可自助接单哦 随时接单更方便】
                `
                ) }}>{newToken || '生成后可以点击我复制'}</Button> </Col>
            </Form>
          </Modal>
          <Table
            columns={columns}
            dataSource={listData}
            scroll={{ x: 1000, }}
            pagination={false}
            rowKey={record => record.order_id} />
          <Pagination
            align="center"
            defaultCurrent={1}
            total={pageTotals}
            current={pageCurrent}
            onChange={onPageChange}
          />
        </Spin>

      </Content>
      {/* <Footer style={footerStyle}>Footer</Footer> */}
    </Layout>

  )
}
export default App;