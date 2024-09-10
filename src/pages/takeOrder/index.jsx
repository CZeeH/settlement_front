import React, { useState, useEffect } from 'react';
import {
  Space, Table, Tag, Button, Drawer, Alert, Col, Row, Modal, Form,
  Input, Spin, Layout, message, Descriptions, Pagination, Popover, Popconfirm
} from 'antd';
import { order_status, layoutStyle, contentStyle, headerStyle, } from './static'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { pathServer } from '../../common'
import {
  AccountBookTwoTone,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';

const { Header, Content } = Layout;
const regex = /^\w{10}-\w{6}$/
const info = () => {
  message.success('复制成功')
}

const App = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(true); // 新建弹窗
  const [isShowDrawer, setShowDrawer] = useState(false); // 新建drawer
  const [modalData, setModalData] = useState([]);// modal数据
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false); // 链接复制弹窗
  const [listData, setlistData] = useState([]); // 页面数据
  const [drawerData, setDrawerData] = useState([]); // 页面数据
  const [modalDetail, setModaDetail] = useState([]);  // 链接弹窗里面的数据
  const [loading, setLoading] = useState(false);
  const [pageTotals, setPageTotals] = useState(0);
  const [drawerPageTotals, setDrawerPageTotals] = useState(10);
  const [pageCurrent, setPageCurrent] = useState(1);
  const [drawerPageCurrent, setDrawerPageCurrent] = useState(1);
  const [token, setToken] = useState(); // 接单凭证
  const [form] = Form.useForm();
  useEffect(() => {
    // getListData()
    // const intervalId = setInterval(() => {
    //   getListData()
    // }, 60000); // 60000 毫秒 = 1 分钟
    // return () => clearInterval(intervalId);
    const get_order_token = localStorage.getItem("icon_take_token");
    if (get_order_token) {
      checkTokenFetch({ get_order_token: get_order_token }, (data) => {
        setToken({ get_order_token, ...data })
        getListData()
        setIsModalOpen(false)
        // const intervalId = setInterval(() => {
        //   getListData()
        // }, 60000); // 60000 毫秒 = 1 分钟
      })
    }
  }, [])
  const checkToken = () => {

  }

  const updateFetch = async (filter, updateDoc, cbFun = () => { }) => {
    setLoading(true)
    fetch(`${pathServer}/check_order_token_and_get_order`, {
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
          cbFun()
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

  const onClickgetOrder = (record) => {
    // 单子是否还在 暂时不检测了 减少服务器压力
    // checkOrderStatus({ order_id: id })
    // setModalData(record)
    // setIsModalOpen(true)
    const { get_order_token, work_wx, work_qq } = token
    updateFetch({ order_id: record.order_id, order_status: order_status.unAssigned }, { order_status: order_status.Assigned, get_order_token, work_wx, work_qq }, () => {
      formatDescription(record)
      setModalData(record)
      setIsDetailModalOpen(true)
    })
  }

  const columns = [
    {
      title: '陪玩项目',
      dataIndex: 'project',
      key: 'project',
      render: (v, record) => {
        return (
          <>
            <Tag color="magenta" >{v}*{record.game_level}</Tag>
            <Tag color="processing" >{record.origin}</Tag>
            <Tag color="gold" >备注：{record.remark}</Tag>
          </>
        )
      }
    },
    {
      title: (<>
        操作
        <Popover content='点击均可复制' title="提示">
          <Tag bordered={false} color="processing" icon={<ExclamationCircleOutlined />}></Tag>
        </Popover>

      </>),
      key: 'action',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="接单确认"
            description={`确定订单：${record.project}\n${record.origin}\n${record.game_level}\n备注：${record.remark === undefined ? '' : record.remark}`}
            onConfirm={() => { onClickgetOrder(record) }}
            onCancel={() => { }}
            okText="立即抢单"
            cancelText="我考虑一下"
          >
            <Button type='primary'>
              接单
            </Button>
          </Popconfirm>
          <Button onClick={() => {
            handleCopy2(record)
          }}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  const drawerColumns = [
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
              <Button type="text" >{v}</Button>
            </CopyToClipboard>
            {record.game_id !== undefined && <CopyToClipboard text={record.game_id} onCopy={info}>
              <Button type="text" >游戏id:{record.game_id}</Button>
            </CopyToClipboard>}
          </>

        )
      }
    },
    {
      title: '陪玩项目',
      dataIndex: 'project',
      key: 'project',
      render: (v, record) => {
        return (
          <>
            <Tag color="magenta" >{v}</Tag>
            <Tag color="processing" >{record.origin}</Tag>
            <Tag color="gold" >备注：{record.remark}</Tag>
          </>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'project',
      key: 'project',
      render: (v, record) => {
        return (
          <>
            <Button type='primary' onClick={() => { handleCopy(record) }}>
              详情
            </Button>
          </>
        )
      }
    },
  ];

  /** modal完成处理 表格提交 反馈 */
  const handleOk = () => {
    form.submit()
  }
  /** modal主动关闭  */
  const handleCancel = () => {
    if (token) {
      setIsModalOpen(false)
    } else {
      message.error('请验证凭证')
    }
  }
  /** 新建订单表格提交 数据收集 数据上传 调用 */

  /**获取历史数据 */
  const getListData = async (query = { order_status: order_status.unAssigned }, skip = 0, limit = 10) => {
    setLoading(true)
    let params = {
      skip,
      limit
    };
    if (query !== undefined) {
      params = { ...query, ...params, order_status: order_status.unAssigned }
    }
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${pathServer}/get_create_orderlist?${queryString}`)
      const res = await response.json()
      setlistData(res.data)
      setPageTotals(res.total)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      message.error(error)
    }
  }

  const getDrawerData = async (query = {}, skip = 0, limit = 10) => {
    setLoading(true)
    let params = {
      skip,
      limit
    };
    if (query !== undefined) {
      params = { ...query, ...params, }
    }
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${pathServer}/get_create_orderlist?${queryString}`)
      const res = await response.json()
      setDrawerData(res.data)
      setDrawerPageTotals(res.total)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      message.error(error)
    }
  }

  const checkOrderStatus = async (query = {}, skip = 0, limit = 10) => {
    setLoading(true)
    let params = {
      skip,
      limit
    };
    if (query !== undefined) {
      params = { ...query, ...params, order_status: order_status.unAssigned }
    }
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${pathServer}/get_create_orderlist?${queryString}`)
      const res = await response.json()
      const { success, data, total } = res || {}
      if (success && total > 0) {
        setModalData(data?.[0])
        setIsModalOpen(true)
        setLoading(false)
      }
      else {
        message.info('手速慢了，单子被抢了哦')
        getListData()
      }
    } catch (error) {
      setLoading(false)
      message.error(error)
    }
  }
  /**检查凭证 */
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
  /** 新建订单表格提交失败处理 反馈 */
  const onFinishFailed = (errorInfo) => {
  };

  const onPageChange = (page, pageSize) => {
    setPageCurrent(page)
    getListData(form.getFieldsValue(true), (page - 1) * pageSize, pageSize)
  };

  const onDrawerPageChange = (page, pageSize) => {
    setDrawerPageCurrent(page)
    getDrawerData(token, (page - 1) * pageSize, pageSize)
  };

  const onFinish = () => {
    const get_order_token = form.getFieldValue('get_order_token')

    checkTokenFetch({ get_order_token: get_order_token }, (data) => {
      localStorage.setItem("icon_take_token", get_order_token)
      setToken({ get_order_token, ...data })
      getListData()
      setIsModalOpen(false)
      // const intervalId = setInterval(() => {
      //   getListData()
      // }, 60000); // 60000 毫秒 = 1 分钟
    })
  }

  const createToken = async () => {
    // jCOUmJ4ehI-hJWKbe
    // cu0Jc9PXA7-eCYHzE
    setLoading(true)
    const params = { work_qq: '956100390', work_wx: '123' }
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await fetch(`${pathServer}/create_get_order_token?${queryString}`)
      const res = await response.json()
      if (res.success) {
        console.log(res, res.get_order_token)
        setLoading(false)
      }
      // setLoading(false)
    } catch (error) {
      setLoading(false)
      message.error(error)
    }
  }

  const formatDescription = (values) => {
    const { game_id, order_id, origin, project, qq_number, game_level } = values || {}
    const items = [
      {
        key: '3',
        label: '游戏id',
        children: `${game_id}`,
      },
      {
        key: '4',
        label: '区服',
        children: `${origin}`,
      },
      {
        key: '1',
        label: '订单号',
        children: `${order_id}`,
      },
      {
        key: '2',
        label: '陪玩/代练项目',
        children: `${project}`,
      },
      {
        key: '5',
        label: '老板qq',
        children: `${qq_number}`,
      },
      {
        key: '8',
        label: '游戏分数/段位',
        children: `${game_level}`,
      },
    ]
    setModaDetail(items)
  }

  const handleCopy = (data) => {
    const formattedText = `
    [区服]:${data.origin}\n
    [游戏项目]:${data.project}\n
    [游戏id/名字]:${data.game_id}\n
    [游戏段位]:${data.game_level || ''}\n
    [订单号]:${data.order_id}\n
    [老板qq]:${data.qq_number}\n
    [备注]:${data.remark || ''}\n
    `;

    clipboardCopy(formattedText)
      .then(() => message.success('信息复制成功 第一时间添加老板扣扣/微信'))
      .catch(err => console.error('复制失败', err));
  };

  const handleCopy2 = (data) => {
    const formattedText = `
    [区服]:${data.origin}\n
    [游戏项目]:${data.project}\n
    [游戏段位]:${data.game_level || ''}\n
    [备注]:${data.remark || ''}\n
    `;

    clipboardCopy(formattedText)
      .then(() => message.success('信息复制成功'))
      .catch(err => console.error('复制失败', err));
  };

  const openMyOrder = () => {
    const { get_order_token } = token
    getDrawerData({ get_order_token })
    setShowDrawer(true)
  }

  const onDrawerClose = () => {
    setShowDrawer(false)
  }

  const toSettlement = () => {
    navigate('/'); // 跳转到 About 页面
  };
  return (
    <Layout style={layoutStyle}>
      <Header style={headerStyle}>
        <Row gutter={5}>
          <Col offset={8}  xs={8} sm={8} md={4} lg={4} xl={4}> <div>icon接单大厅</div></Col>
        </Row>
        <Row gutter={5}>
          <Col xs={6} sm={6} md={4} lg={4} xl={4}> <Button type='primary' onClick={() => { getListData() }} loading={loading}>刷新</Button></Col>
          {/* <Col xs={8} sm={8} md={4} lg={4} xl={4}> <Button type='primary' onClick={() => { createToken() }}>创建凭证</Button></Col> */}
          <Col xs={10} sm={10} md={4} lg={4} xl={4}> <Button type='primary' icon={<AccountBookTwoTone></AccountBookTwoTone>} loading={loading} onClick={() => { openMyOrder() }}>我抢到的订单</Button></Col>
          <Col xs={8} sm={8} md={4} lg={4} xl={4}> <Button type='primary' loading={loading} onClick={() => { toSettlement() }}>结算</Button></Col>
        </Row>
      </Header>
      <Content style={contentStyle}>
        <Spin spinning={loading}>
          <Alert message="王者技术陪规则：陪玩固定局数，输且非mvp送一局上星代练 【禁止陪玩多陪】" type="info" />
          <Alert message="接单后订单就是你的，如果联系不到老板而炸单、弃单罚款【6元转77】【扣扣和王者里都联系不到老板跟客服说】" type="error" />
          <Table
            columns={columns}
            dataSource={listData}
            scroll={{ x: 400, }}
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
        <Drawer
          title="我的订单"
          width={720}
          onClose={onDrawerClose}
          open={isShowDrawer}
          size='large'
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
          extra={
            <Space>
              <Button onClick={onDrawerClose}>关闭</Button>
            </Space>
          }
          loading={loading}
        >
          <Table
            columns={drawerColumns}
            dataSource={drawerData}
            scroll={{ x: 400, }}
            pagination={false}
            rowKey={record => record.order_id} />
          <Pagination
            align="center"
            defaultCurrent={1}
            total={drawerPageTotals}
            current={drawerPageCurrent}
            onChange={onDrawerPageChange}
          />
        </Drawer>
      </Content>
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
          form={form}
          onFinish={onFinish}
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
        </Form>
      </Modal>

      <Modal
        title="订单信息"
        open={isDetailModalOpen}
        onOk={() => {
          setIsDetailModalOpen(false)
          getListData()
        }}
        okText='完成接单'
        cancelText='取消'
        onCancel={() => { setIsDetailModalOpen(false) }}
        clearOnDestroy
      >
        <Alert message="恭喜抢单成功哦，第一时间先去加老板qq联系到老板哦" type="success" />
        <Descriptions
          bordered
          title="订单链接与信息"
          size='small'
          extra={<Button type="primary" onClick={() => { handleCopy(modalData) }}>一键复制对接信息</Button>}
          items={modalDetail}
        />
      </Modal>

      {/* <Footer style={footerStyle}>Footer</Footer> */}
    </Layout>

  )
}
export default App;