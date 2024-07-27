import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
// const getBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

const headers = {'X-Requested-With':null}

const App = () => {
  const [fileList, setFileList] = useState([]);
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        上传收款码
      </div>
    </button>
  );
  return (
    <>
      <Upload
        accept='image/*'
        action="http://localhost:3000/upload"
        listType="picture-circle"
        fileList={fileList}
        onChange={handleChange}
        maxCount={1}
        name='paymentCode'
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
    </>
  );
};
export default App;