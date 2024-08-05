import { Badge,Image } from 'antd';
const imgUrl = 'src/assets/2icon.jpg'
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

const connectMan = [
  {
    key: '1',
    label: '微信账号',
    children: 'SKY-777A',
  },
  {
    key: '2',
    label: 'qq账号',
    children: '956100390',
  },
  {
    key: '3',
    label: '区',
    children: '956100390',
  },
  {
    key: '3',
    label: '操作指南',
    children: <>
      <h1>如何找到我的陪陪 </h1>
      <div>扫描扣扣群进群/通过群号加入对接群 </div>
      <div>粘贴订单信息到群里等待陪陪联系完成对接 </div>
    </>,
  },
  {
    key: '5',
    label: '对接扣扣群',
    children:  <Image
    width={330}
    height={420}
    src={imgUrl}
/>,
  },
]

export { items,connectMan }