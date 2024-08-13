import { Badge, Image } from 'antd';
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
    label: '联系微信',
    children: 'SKY-777A',
  },
  {
    key: '2',
    label: '联系qq群账号',
    children: '885967844',
  },
  // {
  //   key: '3',
  //   label: '操作指南',
  //   children: <>
  //     <h1>如何找到我的陪陪 </h1>
  //     <h2>扫描扣扣群进群/通过群号加入对接群 </h2>
  //     <h2>粘贴订单信息到群里等待陪陪联系完成对接 </h2>
  //   </>,
  // },
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

const des_image =  {
  color: 'blue',
  fontSize: '20px',
};


export { items, connectMan }