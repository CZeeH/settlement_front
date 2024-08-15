import { Badge } from 'antd';
const items = [
  {
    key: '3',
    label: '游戏id',
    children: '李刚爱王者',
  },
  {
    key: '4',
    label: '区服',
    children: '安卓QQ',
  },
  {
    key: '1',
    label: '订单号',
    children: '240725-086303055511461',
  },
  {
    key: '5',
    label: '订单状态',
    children: <Badge status="processing" text="匹配完成" />,
  },
  {
    key: '2',
    label: '陪玩/代练项目',
    children: '技术陪玩3局',
  },
]
/** 
 * unSubmitted: 未提交信息，表单页面
  submitted:  提交信息了 匹配页面 就是 unAssigned
  wrongCode: key没有输入或者输入错误，显示提示页面
  Assigned: 匹配完成
  */
const orderStatus = {
  unSubmitted: '1', // 未提交信息，表单页面
  submitted: '2', // 提交信息了 匹配页面 就是 unAssigned
  wrongCode: '0', // key没有输入或者输入错误，显示提示页面
  Assigned: '3'
}

const headerStyle = {
  textAlign: 'center',
  // color: '#fff',
  // height: 64,
  // paddingInline: 48,
  // lineHeight: '64px',
  backgroundColor: '#fff',
};
const contentStyle = {
  // textAlign: 'center',
  minHeight: '120em',
  lineHeight: '120px',
  padding: '10px',
  // color: '#fff',
  // backgroundColor: '#0958d9',
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
  width: 'calc(100% - 8px)',
  maxWidth: 'calc(100% - 8px)',
};
export { items,orderStatus, layoutStyle, footerStyle, siderStyle, contentStyle, headerStyle }