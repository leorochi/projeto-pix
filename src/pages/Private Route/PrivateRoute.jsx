import React from 'react'
import { auth } from '../../services/FirebaseConfig'


const PrivateRoute = ({children}) => {

  const isAuthenticated = auth.currentUser;

  return isAuthenticated ? children : <h3>Você não tem permissão para acessar essa página</h3>

} 

export default PrivateRoute