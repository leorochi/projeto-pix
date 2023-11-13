import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PaginaInicial from './pages/PaginaInicial.jsx/PaginaInicial';
import PrivateRoute from './pages/Private Route/PrivateRoute';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/paginainicial' element={<PrivateRoute><PaginaInicial/></PrivateRoute>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes