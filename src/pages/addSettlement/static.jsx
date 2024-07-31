const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    // backgroundColor: '#1677ff',
};
const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    // backgroundColor: '#4096ff',
};
const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    // width: 'calc(50% - 8px)',
    // maxWidth: 'calc(50% - 8px)',
};

const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
};
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    padding: 20
    // color: '#fff',
    // backgroundColor: '#0958d9',
};

const baseStyle = {
    width: '25%',
    height: 54,
};

const titleStyle = {
    fontSize: '20px'
}

const projectData = [
    {
        value: '王者荣耀',
        label: '王者荣耀',
        children: [
            {
                value: '技术陪',
                label: '技术陪',
                children: [
                    {
                        value: '7局',
                        label: '7局(10.5元)',
                    },
                    {
                        value: '6局',
                        label: '6局(9元)',
                    },
                    {
                        value: '5局',
                        label: '5局(7.5元)',
                    },
                    {
                        value: '4局',
                        label: '4局(6元)',
                    },
                    {
                        value: '3局',
                        label: '3局(4.5元)',
                    },
                    {
                        value: '2局',
                        label: '2局(3元)',
                    },
                    {
                        value: '1局',
                        label: '1局(1.5元)',
                    },
                ]
            },
            {
                value: '娱乐陪',
                label: '娱乐陪',
                children: [
                    {
                        value: '7局',
                        label: '7局(5.6元)',
                    },
                    {
                        value: '6局',
                        label: '6局(4.8元)',
                    },
                    {
                        value: '5局',
                        label: '5局(4.0元)',
                    },
                    {
                        value: '4局',
                        label: '4局(3.2元)',
                    },
                    {
                        value: '3局',
                        label: '3局(2.4元)',
                    },
                    {
                        value: '2局',
                        label: '2局(1.6元)',
                    },
                    {
                        value: '1局',
                        label: '1局(0.8元)',
                    },
                ]
            },

        ],
    },
    {
        value: '光遇',
        label: '光遇',
        children: [
            {
                value: '角色扮演陪（三恋等）',
                label: '角色扮演陪（三恋白鸟等）',
                children: [
                    {
                        value: '120min',
                        label: '120min(12元)',
                    },
                    {
                        value: '60min',
                        label: '60min(6元)',
                    },
                    {
                        value: '30min',
                        label: '30min(3元)',
                    },
                    {
                        value: '15min',
                        label: '15min(1.5元)',
                    },
                ]
            },
            {
                value: '普陪',
                label: '普陪',
                children: [
                    {
                        value: '120min',
                        label: '120min(5元)',
                    },
                    {
                        value: '60min',
                        label: '60min(2.5元)',
                    },
                    {
                        value: '30min',
                        label: '30min(1.25元)',
                    },
                    {
                        value: '15min',
                        label: '15min(0.75元)',
                    },


                ]
            },

        ],
    },
    {
        value: '蛋仔派对',
        label: '蛋仔派对',
        children: [

            {
                value: '上分陪',
                label: '上分陪',
                children: [
                    {
                        value: '120min',
                        label: '120min(8元)',
                    },
                    {
                        value: '60min',
                        label: '60min(4元)',
                    },
                    {
                        value: '30min',
                        label: '30min(2元)',
                    },
                    {
                        value: '15min',
                        label: '15min(1元)',
                    },
                ]
            },
            {
                value: '娱乐陪',
                label: '娱乐陪',
                children: [
                    {
                        value: '120min',
                        label: '120min(4元)',
                    },
                    {
                        value: '60min',
                        label: '60min(2元)',
                    },
                    {
                        value: '30min',
                        label: '30min(1元)',
                    },
                    {
                        value: '15min',
                        label: '15min(0.5元)',
                    },
                ]
            },
        ],
    },
]

export { contentStyle, headerStyle, layoutStyle, footerStyle, siderStyle, baseStyle, titleStyle, projectData }