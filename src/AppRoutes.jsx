import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import PaginaInicial from './pages/PaginaInicial.jsx/PaginaInicial';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/paginainicial' element={<PaginaInicial/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes