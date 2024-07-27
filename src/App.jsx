import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import OrderTable from './pages/orderTable/index'
import Home from './pages/home/index';
import NotFound from './pages/notFound/index';
import addSettlement from './pages/addSettlement/index';
import './App.css'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/order_table" element={OrderTable()} />
          <Route path="/home" element={addSettlement()} />
          <Route path="/add_settlement" element={addSettlement()} />
          <Route path="*" element={NotFound()} />
        </Routes>
      </Router>
    </>
  )
}


export default App
