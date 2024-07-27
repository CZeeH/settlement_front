import { BrowserRouter as Router, Route, Routes,HashRouter } from 'react-router-dom'
import OrderTable from './pages/orderTable/index'
import NotFound from './pages/notFound/index';
import addSettlement from './pages/addSettlement/index';
import './App.css'

const App = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/order_table" element={OrderTable()} />
          <Route path="/" element={addSettlement()} />
          <Route path="*" element={NotFound()} />
        </Routes>
      </HashRouter>
    </>
  )
}


export default App
