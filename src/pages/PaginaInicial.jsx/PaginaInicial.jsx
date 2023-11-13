import React, { useEffect, useState } from 'react'
import { app, auth, db } from '../../services/FirebaseConfig';
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Navigate, useNavigate } from 'react-router-dom';
import Login from '../Login/Login';


const PaginaInicial = () => {

  const [userSaldo, setUserSaldo] = useState(null);
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');
  const [userId, setUserId] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);
  const [saldoAtual, setSaldoAtual] = useState(null);
  const [contaBancaria, setContaBancaria] = useState('');
  const [inputConta, setInputConta] = useState('');

  const usersCollectionRef = collection(db, 'users');
  const transactionCollectionRef = collection(db, `users/${userId}/transactions`);

  
  useEffect(() => {
    const getUserData = async () => {
      const user = auth.currentUser;

      if(user) {
        const q = query(usersCollectionRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userSaldo = querySnapshot.docs[0].data().saldo;
          const userId = querySnapshot.docs[0].id;
          setUserId(userId);
          setUserSaldo(userSaldo);
          setSaldoAtual(userSaldo);
          localStorage.setItem('saldo', userSaldo);

        }
      }
    }
    getUserData(); 
  }, []);

    //PEGANDO O DOCUMENTO PARA BUSCAR A INFORMAÇÃO DAS CONTAS BANCÁRIAS
    useEffect(() => {
      const getContaBancaria = async () => {
        const dados = await getDocs(collection(db, 'users'));
        const contas = dados.docs.map(doc => doc.data().contaBancaria);
        setContaBancaria(contas);
        console.log(contaBancaria)
      } 
      getContaBancaria();
    }, []);

    

  function resetInputs(){
    setTipo('');
    setValor('');
  }

  async function handleTransaction(e) {
    e.preventDefault();
    const transactionRef = await addDoc(transactionCollectionRef, {
      tipo, valor: valor, contaBancariaDestinario: contaBancaria
    })

      

    resetInputs();
    alert('Transação efetuada com sucesso')

    /*if(tipo === 'entrada') {  
      const novoSaldo = Number(userSaldo) + Number(valor);
      setUserSaldo(novoSaldo);
      setSaldoAtual(novoSaldo);
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        saldo: novoSaldo
      })
      localStorage.setItem('saldo', novoSaldo); 
    }
    if(tipo === 'saída') {
      const novoSaldo = userSaldo - valor;
      setUserSaldo(novoSaldo);
      setSaldoAtual(novoSaldo);
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        saldo: novoSaldo
      })
      localStorage.setItem('saldo', novoSaldo); 
    }
    alert('Transação efetuada com sucesso!!')
    resetInputs();
    }*/
  }
   
     async function handleLogout() {
      await auth.signOut();
      setLoggedOut(true);
    }

    if(loggedOut) return <Navigate to='/'/>
   
    const atual = localStorage.getItem('saldo');
    
  return (
    <div>
      <h1>Transações</h1>
      <h3> Saldo do usuário: {atual}</h3>
      <form onSubmit={handleTransaction}>
        <label htmlFor="contaBancaria" >Digite a conta bancária do usuário: </label>
        <input type="number" value={inputConta} onChange={(e) => setInputConta(e.target.value)}/>
        <label htmlFor="valor">Digite o valor: </label>
        <input type="number" value={valor} onChange={(e) => setValor(e.target.value)}/>
        <button>Realizar transação</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default PaginaInicial