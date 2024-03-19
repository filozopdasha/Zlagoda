
import './App.css';
import Login from '../LoginPage/Login';
import {BrowserRouter, useLocation, Routes, Route, Link} from 'react-router-dom';
import ProductsPage from "../ProductsPage/ProductsPage";
import AddProductPage from "../ProductsPage/AddProductPage";


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/add-product" element={<AddProductPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
