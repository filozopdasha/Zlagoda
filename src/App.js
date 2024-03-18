
import './App.css';
import Login from './Login';
import {BrowserRouter, useLocation, Routes, Route, Link} from 'react-router-dom';
import Products from "./Products";


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Products />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
