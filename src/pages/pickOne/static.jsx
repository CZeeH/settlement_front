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
export { items }