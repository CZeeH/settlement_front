import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Radio, Flex, Descriptions,message } from 'antd';
import { items,connectMan } from './static'
import clipboardCopy from 'clipboard-copy';
const { Option } = Select;

const pageStatusList = {
  unSubmitted: '1',
  submitted: '2',
}

const FormPage = () => {
  const [data, setData] = useState({
    order_id:'240725-086303055511461',
    region:'安卓qq',
    project:'技术陪玩3局',
    level:'王者一星',
    name_id:'李刚爱王者',
    game:'王者荣耀'
  });// 页面数据
  const [loading, setLoading] = useState([]);// 页面数据
  const [pageStatus, setPageStatus] = useState(pageStatusList.unSubmitted);// 页面数据

  const onFinish = (values) => {
    console.log('Received values:', values, pageStatus);
    // 这里可以处理表单提交的逻辑
    setPageStatus(pageStatusList.submitted)
  };

  const handleCopyClick = () => {
    const formattedText = `
    [订单号]:${data.order_id}
    [区服]:${data.region}
    [游戏项目]:${data.project}
    [游戏id/名字]:${data.name_id}
    [游戏段位]:${data.level}
    [游戏]:${data.game}
    `;
    clipboardCopy(formattedText)
      .then(() => message.success('信息复制成功 扫码进群对接即可'))
      .catch(err => console.error('复制失败', err));
  };


  return (
    pageStatus === pageStatusList.unSubmitted ?
      (
        <>
          <Flex gap="middle" align="center" vertical>
            {/* <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
              订单匹配中，亲亲稍等5分钟左右，在这里可以看到陪陪信息
            </div> */}
            <Descriptions
              title="您的订单信息"
              size='small'
              extra={<Button type="primary" onClick={handleCopyClick}>一键复制</Button>}
              bordered
              borderRadius
              items={items}
            />

            <Descriptions
              title="对接陪玩信息"
              size='small'
              // extra={<Button type="primary">Edit</Button>}
              bordered
              borderRadius
              items={connectMan}
            />
          </Flex>
        </>
      ) : (
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
                name="id"
                rules={[{ required: true, message: '请输入ID!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="区服选择"
                name="origin"
                rules={[{ required: true, message: '请选择区服!' }]}
              >
                <Radio.Group>
                  <Radio value='android_qq'>安卓QQ区</Radio>
                  <Radio value='ios_qq'>苹果QQ区</Radio>
                  <Radio value='android_wx'>安卓微信区</Radio>
                  <Radio value='ios_wx'>苹果微信区</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="对接方式"
                name="您希望在qq还是微信进行陪玩对接"
                rules={[{ required: true, message: '请选择陪玩项目!' }]}
              >
                <Radio.Group>
                  <Radio value='qq'>QQ</Radio>
                  <Radio value='wx'>微信</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="备注"
                name="remark"
                rules={[{ required: false, message: '请选择陪玩项目!' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
                  点击开始匹配陪玩
                </Button>
              </Form.Item>
            </Form>
          </div>
        </>
      )

  );
};

export default FormPage;
