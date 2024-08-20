import { HashRouter, Route, Routes } from 'react-router-dom';
import SettlementList from './pages/settlementList/index';
import NotFound from './pages/notFound/index';
import AddSettlement from './pages/addSettlement/index';
import PickOne from './pages/pickOne/index';
import OrderList from './pages/orderList/index';
import CheckSettlement from './pages/checkSettlement/index'
import TakeOrder from './pages/takeOrder/index'
import TokenManage from './pages/tokenManage/index'
import './App.css';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/settlement_list" element={<SettlementList />} />
        <Route path="/check_settlement" element={<CheckSettlement />} />
        <Route path="/order_list" element={<OrderList />} />
        <Route path="/take_order" element={<TakeOrder />} />
        <Route path="/pick" element={<PickOne />} />
        <Route path="/token_manage" element={<TokenManage />} />
        <Route path="/" element={<AddSettlement />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
