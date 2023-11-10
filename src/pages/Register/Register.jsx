import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { app, auth, db } from '../../services/FirebaseConfig';
import 'firebase/firestore';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

const Register = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const contaBancaria = Math.floor(Math.random() * 11111111) + 99999999
  const saldo = 0;


   const usersCollectionRef = collection(db, 'users');
  
  const transactionCollectionRef = collection(usersCollectionRef, 'transactions');
  

  const [createUserWithEmailAndPassword, user, loading, error,] =
  useCreateUserWithEmailAndPassword(auth); 

  async function handleSignIn(e) {
    e.preventDefault();
    createUserWithEmailAndPassword(email, password);
    await addDoc(usersCollectionRef, {
     contaBancaria, saldo
    })


  }

  return (
    <form onSubmit={handleSignIn}>
      <label htmlFor="email">Digite o e-mail: </label>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Digite a senha: </label>
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button>Cadastrar</button>
      <div>
      <p>Já tem uma conta? <Link to='/'>Clique aqui</Link> para voltar a tela de Login</p>
      </div>
    </form>
  )
}

export default Register