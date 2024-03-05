
import './App.css';
import Login from './Login';
import {BrowserRouter, useLocation, Routes, Route, Link} from 'react-router-dom';


function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
