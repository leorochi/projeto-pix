import React, { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../services/FirebaseConfig';
import PaginaInicial from '../PaginaInicial.jsx/PaginaInicial';


const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const [SignInWithEmailAndPassword, user, loading, error,
  ] = useSignInWithEmailAndPassword(auth);
 
  function handleSignIn(e) {
    e.preventDefault();
    SignInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
  }

  if(loading) <p>Carregando...</p>
  if(user) return <Navigate to='/paginainicial'/>
  
  return (
    <form onSubmit={handleSignIn}>
      <h1>Faça seu Login</h1>
      <label htmlFor="email">E-mail: </label>
      <input type="text" placeholder='Digite seu e-mail' onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password" placeholder='Digite sua senha'></label>
      <input type="password" placeholder='Digite sua senha' onChange={(e) => setPassword(e.target.value)}/>
        <button>Logar</button>
      <div>
        <p>Ainda não tem uma conta? <Link to='/register'>Clique aqui</Link> para criar</p>
      </div>
      {error && <p style={{color: 'red'}}>Ocorreu um erro, tente novamente!</p>}
    </form>
  )

}

export default Login