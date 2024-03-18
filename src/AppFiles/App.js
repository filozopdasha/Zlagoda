
import './App.css';
import Login from '../LoginPage/Login';
import {BrowserRouter, useLocation, Routes, Route, Link} from 'react-router-dom';
import Products from "../ProductsPage/Products";


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
            <Route path="/products" element={<Products />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
