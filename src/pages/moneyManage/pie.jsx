import React from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';

const DemoPie = (pData) => {
    console.log(pData)
    const config = {
        data: pData,
        angleField: 'value',
        colorField: 'type',
        paddingRight: 80,
        innerRadius: 0.6,
        label: {
            text: ({ value, type }) => {
                return `${type}: ${value}`;
              },
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
        annotations: [
            {
                type: 'text',
                style: {
                    text: '本月工资',
                    x: '50%',
                    y: '50%',
                    textAlign: 'center',
                    fontSize: 40,
                    fontStyle: 'bold',
                },
            },
        ],
    };
    return <Pie {...config} />;
};

// ReactDOM.render(<DemoPie />, document.getElementById('container'));
export default DemoPie;