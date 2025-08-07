import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/Login'; 

import Home from './home/Home';
import Customerdashboard from './customer-dashboard/Customerdashboard';
import Admin from './admin/Admin';
import Admindashboard from './admin-dashboard/Admindashboard';
import Loginregister from './login-register/Loginregister';
import Registeradmin from './registeradmin/Registeradmin';


function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
           <Route path="/customer-dashboard" element={<Customerdashboard />}/>
        <Route path="/login-admin" element={<Admin />} />
         <Route path="/login-register" element={<Loginregister />} />

      
        
         <Route path="/admin-dashboard" element={<Admindashboard />} />
         <Route path="/registeradmin" element={<Registeradmin />} />
        {/* You can add more routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
