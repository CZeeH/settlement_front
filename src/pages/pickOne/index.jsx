import React, { useState, useEffect } from 'react';
import { Form, Input, Badge, Button, Radio, Carousel, Layout, Progress, Flex, Descriptions, message, Result, Spin, Alert, Image, Modal } from 'antd';
import clipboardCopy from 'clipboard-copy';
import { pathServer } from '../../common'
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { layoutStyle, footerStyle, siderStyle, contentStyle, headerStyle, orderStatus } from './static'

const { Header, Footer, Sider, Content } = Layout;


const info = () => {
  message.success('复制成功')
}

const FormPage = () => {
  const location = useLocation();
  const [data, setData] = useState({});// 页面数据
  const [descriptionsDetailForMe, setDescriptionsDetailForMe] = useState({});// 订单信息
  const [loading, setLoading] = useState(false);// 页面数据
  const [pageStatus, setPageStatus] = useState();// 页面数据
  const [connectMan, setConnectMan] = useState([]);// 匹配到的详情

  useEffect(() => {
    checkCode()
  }, [])
  /**检查是否有key 对应好订单 确定状态 */
  const checkCode = async (id) => {
    let res = {}
    if (!id) {
      const { key } = queryString.parse(location.search); // 解析查询参数
      if (key === undefined) {
        setPageStatus(orderStatus.wrongCode)
        return
      }
      res = await getData({ random_string: key }, (init) => {
        setConnect(init)
      })
    } else {
      res = await getData({ order_id: id }, (init) => {
        setConnect(init)
      })
    }
    const { total, data } = res
    // key 错误
    if (Number(total) === 0) {
      setPageStatus(orderStatus.wrongCode)
      return
    }
    setData(data[0])
    //  Assigned && submitted
    setPageStatus(data[0].order_status)
    formatDescription(data[0])
    if (data[0].order_status === orderStatus.Assigned) {
      return
    }

    if (data[0].order_status === orderStatus.submitted) {
      const intervalId = setInterval(() => {
        checkStatus()
      }, 60000); // 60000 毫秒 = 1 分钟
      return
    }
    // 有 submitted
  }


  const checkStatus = async () => {
    const newData = await getData({ order_id: data.order_id }, (init) => {
      if (init.order_status !== data.order_status) {
        setConnect(init)
      }
    })
    setData(newData[0])
    if (newData[0].order_status === orderStatus.Assigned) {
      clearInterval(intervalId)
    }
  }

  const setConnect = (init = {}) => {
    let item = []
    if (init.order_status === orderStatus.Assigned) {
      item = [
        {
          key: '1',
          label: '陪陪联系微信',
          children: (
            init.work_wx ? (
              <CopyToClipboard text={init.work_wx || ''} onCopy={info}>
                <Button type="primary" color=''>{init.work_wx || ''}</Button>
              </CopyToClipboard>
            ) : (
              <>
                陪陪即将添加您，请关注联系信息，超过10分钟未联系请告知客服。
              </>
            )
          ),
        },
        {
          key: '2',
          label: '陪陪联系qq',
          children: (
            init.work_qq ? (
              <CopyToClipboard text={init.work_qq || ''} onCopy={info}>
                <Button type="primary" color=''>{init.work_qq || ''}</Button>
              </CopyToClipboard>
            ) : (
              <>
                -
              </>
            )
          ),
        },
        {
          key: '2',
          label: '售后/找不到陪陪/抽奖qq群账号',
          children: (
            <CopyToClipboard text='885967844' onCopy={info}>
              <Button type="primary" color=''>885967844</Button>
            </CopyToClipboard>
          ),
        },
        {
          key: '5',
          label: '抽奖/售后扣扣群 图片可点',
          children: (
            <div>
              <h3 >售后问题/每周抽荣耀皮肤 进群</h3>
              <Image
                width='15em'
                height='auto'
                alt='扫码进群'
                src='http://play-list-for-pic.oss-cn-hangzhou.aliyuncs.com/2024813-payment-Iaw8Tr20QjXN.jpg'
              />
            </div>
          )
        },
        {
          key: '9',
          label: '匹配完成',
          children: (
            <>
              <Progress type="circle" percent={100} />
              <div> 陪玩匹配完成，请点击陪陪联系方式直接联系陪陪即可 祝您游戏常胜！</div>
            </>
          ),
        },
      ]
    } else {
      item = [
        {
          key: '1',
          label: '陪玩匹配中',
          children: (
            <>
              <Progress type="circle" percent={75} />
              <div> 陪玩匹配中， 请稍等，匹配完成将显示陪玩联系方式</div>
            </>
          ),
        },
        {
          key: '5',
          label: '对接扣扣群 图片可点 ',
          children: (
            <div>
              <h3 >售后问题/每周抽荣耀皮肤 进群</h3>
              <Image
                width='15em'
                height='auto'
                alt='扫码进群'
                src='http://play-list-for-pic.oss-cn-hangzhou.aliyuncs.com/2024813-payment-Iaw8Tr20QjXN.jpg'
              />
            </div>
          )
        },
      ]
    }

    setConnectMan(item)
  }


  const getData = async (query, cb = () => { }) => {
    setLoading(true);
    let params = {
      skip: 0,
      limit: 10
    };

    if (query !== undefined) {
      params = { ...query, ...params };
    }
    // 构建查询字符串
    const queryString = new URLSearchParams(params).toString();

    try {
      const response = await fetch(`${pathServer}/get_create_orderlist?${queryString}`);
      const res = await response.json();
      // 更新状态
      setLoading(false);
      cb(res.data[0])
      return res;
    } catch (error) {
      setLoading(false);
      message.error('获取失败');
      // 处理错误情况，比如可以返回一个空对象或其他合适的默认值
      return {
        data: [],
        total: 0
      };
    }
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

  const onFinish = (values) => {
    updateFetch({ order_id: data.order_id }, { order_status: orderStatus.submitted, assign_time: (new Date()).toLocaleString(), ...values }, () => {
      checkCode(data.order_id)
    })

    // 这里可以处理表单提交的逻辑
  };

  const handleCopyClick = () => {
    const formattedText = `
    [区服]:${data.origin}\n
    [游戏项目]:${data.project}\n
    [游戏id/名字]:${data.game_id}\n
    [游戏段位]:${data.game_level || ''}\n
    [订单号]:${data.order_id}\n
    [备注]:${data.remark || ''}\n
    `;

    clipboardCopy(formattedText)
      .then(() => message.success('信息复制成功 扫码进群对接即可'))
      .catch(err => console.error('复制失败', err));
  };
  /** 形成第一个description的数据格式 */
  const formatDescription = (values) => {
    const { game_id, order_id, origin, project, order_status } = values || {}
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

    ]
    setDescriptionsDetailForMe(items)
  }

  return (
    <Flex gap="middle" wrap>
      <Layout style={layoutStyle}>
        <Spin spinning={loading}>


          {
            pageStatus === orderStatus.unSubmitted &&
            <>
              <div style={{ padding: '20px' }}>
                <Header style={{ backgroundColor: '#ffffff', padding: '5px', fontSize: '1rem', fontWeight: 'bold', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }}>
                  <div >Icon游戏俱乐部订单信息</div>
                </Header>
                <Form
                  name="basic"
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                  style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.4)' }}
                >

                  <Form.Item
                    label="游戏ID/游戏里的名字"
                    name="game_id"
                    tooltip='名字/id错误会导致陪陪联系不到您哦'
                    rules={[{ required: true, message: '请输入ID!' }]}

                  >
                    <Input placeholder="游戏名字/游戏id " />
                  </Form.Item>

                  <Form.Item
                    label="区服选择"
                    name="origin"
                    rules={[{ required: true, message: '请选择区服!' }]}
                  >
                    <Radio.Group>
                      <Radio value='安卓QQ区'>安卓QQ区</Radio>
                      <Radio value='苹果QQ区'>苹果QQ区</Radio>
                      <Radio value='安卓微信区'>安卓微信区</Radio>
                      <Radio value='苹果微信区'>苹果微信区</Radio>
                    </Radio.Group>
                  </Form.Item>

                  {/* <Form.Item
                  label="对接方式"
                  name="contract_type"
                  rules={[{ required: true, message: '请选择陪玩项目!' }]}
                >
                  <Radio.Group>
                    <Radio value='QQ'>QQ</Radio>
                    <Radio value='微信'>微信</Radio>
                  </Radio.Group>
                </Form.Item> */}
                  <Form.Item
                    label="目前的游戏段位/游戏分数"
                    name="game_level"
                    rules={[{ required: true, message: '请选择陪玩项目!' }]}
                  >
                    <Input placeholder="例如：王者荣耀： 钻石三 或者 蛋仔2100分  光遇填无" />
                  </Form.Item>
                  <Form.Item
                    label="备注"
                    name="remark"
                    tooltip="如需指定男女等 无特别要求可以不填"
                    rules={[{ required: false, message: '请选择陪玩项目!' }]}
                  >
                    <Input placeholder="我不需要指定" />
                  </Form.Item>
                  <Form.Item
                    label="qq号码"
                    name="qq_number"
                    tooltip='[确保扣扣可以被陪陪添加哦 陪陪才可以找到您]'
                    rules={[{ required: true, message: '请输入qq号!' }]}
                  >
                    <Input placeholder="qq号" />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      点击开始匹配陪玩
                    </Button>
                  </Form.Item>
                </Form>
                <div>
                  <Carousel autoplay infinite={false} arrows>
                    <div>
                      <Image src='http://play-list-for-pic.oss-cn-hangzhou.aliyuncs.com/2024814-payment-wXFbiFyNI5Q7.jpg' width={200}
                        height='auto' />
                    </div>
                    <div>
                      <Image src='http://play-list-for-pic.oss-cn-hangzhou.aliyuncs.com/2024814-payment-N8olMo2v2J22.jpg' width={200}
                        height='auto' />
                    </div>
                    <div>
                      <Image src='http://play-list-for-pic.oss-cn-hangzhou.aliyuncs.com/2024814-payment-M49ExS9vbHBv.jpg' width={200}
                        height='auto' />
                    </div>
                    <div>
                      <Image src='http://play-list-for-pic.oss-cn-hangzhou.aliyuncs.com/2024814-payment-HUUDe5iTFpCs.jpg' width={200}
                        height='auto' />
                    </div>
                  </Carousel>
                </div>

              </div>
            </>
          }
          {
            [orderStatus.submitted, orderStatus.Assigned].includes(pageStatus) &&
            (
              <>
                <Flex gap="middle" align="star" vertical >
                  {/* <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
                订单匹配中，亲亲稍等5分钟左右，在这里可以看到陪陪信息
                </div> */}
                  <Content style={contentStyle}>
                    <Descriptions
                      title="您的订单信息"
                      size='small'
                      extra={<Button type="primary" onClick={handleCopyClick}>一键复制对接信息</Button>}
                      bordered
                      // borderRadius
                      items={descriptionsDetailForMe}
                    />
                    {pageStatus === orderStatus.submitted && <Alert message="您的陪玩正在匹配中，一般需要10 - 15分钟左右，匹配完成下方会显示陪陪联系信息哦" type="info" />}
                    {pageStatus === orderStatus.Assigned && <Alert message="如何联系陪玩：下方显示陪玩联系方式，通过联系方式可以联系到您的陪陪哦" type="success" />}
                    {pageStatus === orderStatus.Assigned && <Alert message="技术陪规则：固定陪玩您下单的局数，如果输了陪陪非mvp送您一局代练" type="info" />}
                    <Descriptions
                      title="对接陪玩信息(下方 点击均可复制)"
                      size='small'
                      // extra={<Button type="primary">Edit</Button>}
                      bordered
                      // borderRadius
                      items={connectMan}
                    />
                  </Content>
                </Flex>

              </>
            )
          }
          {
            pageStatus === orderStatus.wrongCode && (
              <Result
                status="warning"
                title="您的链接错误 请检查是否复制完全。要复制完全才可以哦（如果还是不行咨询一下客服姐姐哦）"
              // extra={
              //   <Button type="primary" key="console">
              //     重新输入
              //   </Button>
              // }
              />
            )
          }
          {/* <Footer style={footerStyle}>Footer</Footer> */}



        </Spin>
      </Layout>
    </Flex>

  )
};

export default FormPage;
