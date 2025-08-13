import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/Login'; 

import Home from './home/Home';
import Customerdashboard from './customer-dashboard/Customerdashboard';
import Admin from './admin/Admin';
import AdminLogin from './admin-login/AdminLogin';

import Register from './register/Register';
import Registeradmin from './registeradmin/Registeradmin';
import Customerprofile from './customer-profile/Customerprofile';
import BookGas from './bookgas/BookGas';
import Payment from './payment/Payment';


function App() {
  const [count, setCount] = useState(0);

  return (
    <BrowserRouter>
      <Routes>
         <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
           <Route path="/customer-dashboard" element={<Customerdashboard />}/>
        <Route path="/login-admin" element={<AdminLogin />} />
         <Route path="/customer-register" element={<Register />} />
         <Route path='/customer-profile' element={<Customerprofile/>}></Route>

      <Route path='/payment' element={<Payment/>}></Route>
              <Route path="/book-gas" element={<BookGas/>}></Route>
        
         <Route path="/admin" element={<Admin />} />
         <Route path="/registeradmin" element={<Registeradmin />} />
        {/* You can add more routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;