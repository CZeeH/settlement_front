import React from 'react';
import { Space, Table, Tag, Input } from 'antd';
const { Search } = Input;
const columns = [
  {
    title: '订单号',
    dataIndex: 'order_id',
    key: 'order_id',
    render: (text) => <a>{text}</a>,
  },
  {
    title: '订单状态',
    dataIndex: 'order_status',
    key: 'order_status',
  },
  {
    title: '下单时间',
    dataIndex: 'order_time',
    key: 'order_time',
  },
  {
    title: '订单项目',
    dataIndex: 'project',
    key: 'project',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: '操作',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a onClick={() => {}}>完成订单</a>
        <a>删除</a>
      </Space>
    ),
  },
];

const App = () => <Table columns={columns} dataSource={[]} />;
export default App;