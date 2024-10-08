
const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 120,
    // paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: 'white',
    padding:10,
};
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    width: '100%',
    color: '#fff',
    // backgroundColor: '#0958d9',
};

const footerStyle = {
    textAlign: 'center',
    color: '#fff',
    // backgroundColor: '#4096ff',
};
const layoutStyle = {
    borderRadius: 8,
    // overflow: 'hidden',
    borderTop: '1px solid #4096ff',
    width: '100%',
    maxWidth: 'calc(100% - 8px)',
};

const headerRowStyle = {
    width: '100%'
}

const midStyle = {
    width:'100%',
    margin: '0 auto'
}

/** 订单状态 */
const order_status = {
    unSubmitted: '1',
    unAssigned: '2',
    Assigned: '3'
}


export {
    headerStyle,contentStyle,footerStyle,layoutStyle,headerRowStyle,midStyle,order_status
}