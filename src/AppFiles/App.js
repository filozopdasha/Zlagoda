import './App.css';
import Login from '../LoginPage/Login';
import {BrowserRouter, useLocation, Routes, Route, Link} from 'react-router-dom';
import ProductsPage from "../ProductsPage/ProductsPage";
import AddProductPage from "../ProductsPage/AddProductPage";
import EditProductPage from "../ProductsPage/EditProductPage";
import EmployeePage from "../EmployeePage/EmployeePage";
import AddEmployeePage from "../EmployeePage/AddEmployeePage";
import EditEmployeePage from "../EmployeePage/EditEmployeePage";
import CategoriesPage from "../Categories/CategoriesPage";
import AddCategoryPage from "../Categories/AddCategoryPage";
import EditCategoryPage from "../Categories/EditCategoryPage";
import CheckPage from "../CheckPage/CheckPage";
import AddCheckAndSalePage from "../CheckPage/AddCheckPage";
import CustomerCardPage from "../CustomerCard/CustomerCardPage";
import AddCustomerCardPage from "../CustomerCard/AddCustomerCardPage";
import EditCustomerCardPage from "../CustomerCard/EditCustomerCardPage";
import StoreProductsPage from "../StoreProducts/StoreProducts";
import EditStoreProductsPage from "../StoreProducts/EditStoreProductsPage";
import AddStoreProductPage from "../StoreProducts/AddStoreProductPage";


function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="/add-employee" element={<AddEmployeePage />} />
            <Route path="/employees/:idempl" element={<EditEmployeePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/products/:id" element={<EditProductPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/add-category" element={<AddCategoryPage />} />
            <Route path="/categories/:id" element={<EditCategoryPage />} />
            <Route path="/cards" element={<CustomerCardPage />} />
            <Route path="/add-card" element={<AddCustomerCardPage />} />
            <Route path="/card/:id" element={<EditCustomerCardPage />} />
            <Route path="/checks" element={<CheckPage />} />
            <Route path="/add-check" element={<AddCheckAndSalePage />} />
            <Route path="/store-products" element={<StoreProductsPage />} />
            <Route path="/edit-product/:id" element={<EditStoreProductsPage/>} />
            <Route path="/add-store-product" element={<AddStoreProductPage/>} />


        </Routes>
      </BrowserRouter>
  );
}

export default App;
