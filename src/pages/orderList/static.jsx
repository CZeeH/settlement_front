/** 订单状态 */
const order_status = {
    unSubmitted: '1',
    unAssigned: '2',
    Assigned: '3'
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
                        value: '1局',
                        label: '1局',
                    },
                    {
                        value: '2局',
                        label: '2局',
                    },
                    {
                        value: '3局',
                        label: '3局',
                    },
                    {
                        value: '4局',
                        label: '4局',
                    },
                    {
                        value: '5局',
                        label: '5局',
                    },
                    {
                        value: '6局',
                        label: '6局',
                    },
                    {
                        value: '7局',
                        label: '7局',
                    },
                ]
            },
            {
                value: '娱乐陪',
                label: '娱乐陪',
                children: [
                    {
                        value: '1局',
                        label: '1局',
                    },
                    {
                        value: '2局',
                        label: '2局',
                    },
                    {
                        value: '3局',
                        label: '3局',
                    },
                    {
                        value: '4局',
                        label: '4局',
                    },
                    {
                        value: '5局',
                        label: '5局',
                    },
                    {
                        value: '6局',
                        label: '6局',
                    },
                    {
                        value: '7局',
                        label: '7局',
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
                        value: '30min',
                        label: '30min',
                    },
                    {
                        value: '15min',
                        label: '15min',
                    },
                    {
                        value: '60min',
                        label: '60min',
                    },
                    {
                        value: '120min',
                        label: '120min',
                    },

                ]
            },
            {
                value: '普陪',
                label: '普陪',
                children: [
                    {
                        value: '30min',
                        label: '30min',
                    },
                    {
                        value: '15min',
                        label: '15min',
                    },
                    {
                        value: '60min',
                        label: '60min',
                    },
                    {
                        value: '120min',
                        label: '120min',
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
                        value: '30min',
                        label: '30min',
                    },
                    {
                        value: '15min',
                        label: '15min',
                    },
                    {
                        value: '60min',
                        label: '60min',
                    },
                    {
                        value: '120min',
                        label: '120min',
                    },

                ]
            },
            {
                value: '娱乐陪',
                label: '娱乐陪',
                children: [
                    {
                        value: '30min',
                        label: '30min',
                    },
                    {
                        value: '15min',
                        label: '15min',
                    },
                    {
                        value: '60min',
                        label: '60min',
                    },
                    {
                        value: '120min',
                        label: '120min',
                    },
                ]
            },
        ],
    },
]

export { projectData, order_status }