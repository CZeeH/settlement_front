import React, { useState, useEffect } from 'react';
import { Form, Input, Badge, Button, Radio, Flex, Descriptions, message, Result, Spin, Alert,Image } from 'antd';
import clipboardCopy from 'clipboard-copy';
import { pathServer } from '../../common'
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const order_status = {
  unSubmitted: '1', // 未提交信息，表单页面
  submitted: '2', // 提交信息了 匹配页面 就是 unAssigned
  wrongCode: '0', // key没有输入或者输入错误，显示提示页面
  Assigned: '3'
}

const info = () => {
  message.success('复制成功')
}

const connectMan = [
  {
    key: '5',
    label: '对接扣扣群',
    children: (
      <div className='des_image'>
        <h3 >老板，扫码进群对接陪陪/代练</h3>
        <Image
          width={330}
          height='auto'
          alt='扫码进群'
          src='http://play-list-for-pic.oss-cn-hangzhou.aliyuncs.com/2024813-payment-Iaw8Tr20QjXN.jpg'
        />
      </div>
    )
  },
  {
    key: '1',
    label: '联系微信',
    children: (
      <CopyToClipboard text='SKY-777A' onCopy={info}>
        <Button type="dashed" color=''>SKY-777A</Button>
      </CopyToClipboard>
    ),
  },
  {
    key: '2',
    label: '联系qq群账号',
    children: (
      <CopyToClipboard text='885967844' onCopy={info}>
        <Button type="dashed" color=''>885967844</Button>
      </CopyToClipboard>
    ),
  },
  {
    key: '6',
    label: '案例参考',
    children: (
      <div className='des_image'>
        <h3 >扫码进群对接陪陪/代练</h3>
        <Image
                  width={330}
                  height='auto'
                  alt='指导'
                  src='http://play-list-for-pic.oss-cn-hangzhou.aliyuncs.com/2024813-payment-1RjuOYZoQbe4.jpg'
                />
      </div>
    )
  },
]

const FormPage = () => {
  const location = useLocation();
  /**检查是否有key 对应好订单 确定状态 */
  const checkCode = async () => {
    // 从 URL 中获取 key 参数
    const { key } = queryString.parse(location.search); // 解析查询参数
    const { data = [], total = 0 } = await getData({ random_string: key })
    if (key === undefined || Number(total) === 0) {
      setPageStatus(order_status.wrongCode)
      return
    }
    setData(data[0])
    if (data[0].order_status !== undefined) {
      setPageStatus(data[0].order_status)
      formatDescription(data[0])
      return
    }
    setPageStatus(order_status.unSubmitted)
  }
  const [data, setData] = useState({});// 页面数据
  const [descriptionsDetailForMe, setDescriptionsDetailForMe] = useState({});// 订单信息

  useEffect(() => {
    checkCode()
  }, [])

  const getData = async (query, skip = 0, limit = 10) => {
    setLoading(true);

    let params = {
      skip,
      limit
    };

    if (query !== undefined) {
      params = { ...query, ...params };
    }

    // 构建查询字符串
    const queryString = new URLSearchParams(params).toString();

    try {
      const response = await fetch(`${pathServer}/get_create_orderlist?${queryString}`);
      const res = await response.json();

      console.log('res ', res);

      // 更新状态
      setLoading(false);

      return {
        data: res.data,
        total: res.total
      };
    } catch (error) {
      setLoading(false);
      console.error('获取失败', error);
      message.error('获取失败');
      // 处理错误情况，比如可以返回一个空对象或其他合适的默认值
      return {
        data: [],
        total: 0
      };
    }
  };

  const [loading, setLoading] = useState([]);// 页面数据
  const [pageStatus, setPageStatus] = useState(order_status.unSubmitted);// 页面数据

  const updateFetch = async (filter, updateDoc, cbFun = () => { }) => {
    console.log('filter', filter, 'updateDoc', updateDoc)
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
    updateFetch({ order_id: data.order_id }, { assign_time: (new Date()).toLocaleString(), ...values, order_status: order_status.submitted }, () => {
      checkCode()
    })

    // 这里可以处理表单提交的逻辑

  };

  const handleCopyClick = () => {
    const formattedText = `
    [区服]:${data.origin}
    [游戏项目]:${data.project}
    [游戏id/名字]:${data.game_id}
    [游戏段位]:${data.game_level}
    [订单号]:${data.order_id}
    `;

    clipboardCopy(formattedText)
      .then(() => message.success('信息复制成功 扫码进群对接即可'))
      .catch(err => console.error('复制失败', err));
  };
  /** 形成第一个description的数据格式 */
  const formatDescription = (values) => {
    const { game_id, order_id, origin, project } = values || {}
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
        key: '5',
        label: '订单状态',
        children: <Badge status="processing" text="匹配完成" />,
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
    <>
      <Spin spinning={loading}>
        {
          pageStatus === order_status.unSubmitted &&
          <>
            <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
              <h1 style={{ color: '#1890ff', marginBottom: '20px' }}>订单信息</h1>
              <Form
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
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

                <Form.Item
                  label="对接方式"
                  name="contract_type"
                  rules={[{ required: true, message: '请选择陪玩项目!' }]}
                >
                  <Radio.Group>
                    <Radio value='QQ'>QQ</Radio>
                    <Radio value='微信'>微信</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item
                  label="目前的游戏段位/游戏分数"
                  name="game_level"
                  rules={[{ required: true, message: '请选择陪玩项目!' }]}
                >
                  <Input placeholder="例如：王者荣耀： 钻石三 或者 蛋仔2100分" />
                </Form.Item>
                <Form.Item
                  label="备注"
                  name="remark"
                  tooltip="如需指定男女等 无特别要求可以不填"

                  rules={[{ required: false, message: '请选择陪玩项目!' }]}
                >
                  <Input placeholder="我不需要指定" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    点击开始匹配陪玩
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </>
        }
        {
          [order_status.submitted,order_status.Assigned].includes(pageStatus) &&
          (
            <>
              <Flex gap="middle" align="center" vertical>
                {/* <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
                订单匹配中，亲亲稍等5分钟左右，在这里可以看到陪陪信息
                </div> */}
                <Descriptions
                  title="您的订单信息"
                  size='small'
                  extra={<Button type="primary" onClick={handleCopyClick}>一键复制对接信息</Button>}
                  bordered
                  // borderRadius
                  items={descriptionsDetailForMe}
                />
                <Alert message="操作步骤： 第一：点击右上角 ”一键复制对接信息“按钮 ，第二步扫qq群码进去粘贴内容对接完成！" type="success" />

                <Descriptions
                  title="对接陪玩信息"
                  size='small'
                  // extra={<Button type="primary">Edit</Button>}
                  bordered
                  // borderRadius
                  items={connectMan}
                />
              </Flex>
            </>
          )
        }
        {
          pageStatus === order_status.wrongCode && (
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
      </Spin>
    </>

  )
};

export default FormPage;
