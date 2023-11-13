import React, { useEffect, useState } from 'react'
import { app, auth, db } from '../../services/FirebaseConfig';
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { Navigate, useNavigate } from 'react-router-dom';
import Login from '../Login/Login';


const PaginaInicial = () => {

  const [userSaldo, setUserSaldo] = useState(null);
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
        
        const q = query(usersCollectionRef, where('email', '==', user.email)); // Cria uma consulta para buscar documentos na coleção de usuários onde o campo 'email' é igual ao e-mail do usuário autenticado.
        
        const querySnapshot = await getDocs(q); //Executa a consulta e aguarda a resposta, obtendo um querySnapshot que contém os resultados da consulta.
        if (!querySnapshot.empty) { //  Verifica se a consulta retornou algum documento.
          const userSaldo = querySnapshot.docs[0].data().saldo; // Extrai o saldo do primeiro documento retornado pela consulta.
          const userId = querySnapshot.docs[0].id;
          setUserId(userId);
          setUserSaldo(userSaldo);
          setSaldoAtual(userSaldo);
          localStorage.setItem('saldo', userSaldo);

        }
      }
    }
    getUserData(); //  Chama a função getUserData para realizar a lógica de obtenção e atualização dos dados do usuário quando o componente é montado.
  }, []);

    //PEGANDO O DOCUMENTO PARA BUSCAR A INFORMAÇÃO DAS CONTAS BANCÁRIAS
    useEffect(() => {
      const getContaBancaria = async () => {
        const dados = await getDocs(collection(db, 'users'));
        const contas = dados.docs.flatMap(doc => doc.data().contaBancaria);
        setContaBancaria(contas);
      } 
      getContaBancaria();
    }, []);


  function resetInputs(){
    setInputConta('');
    setValor('');
  }

  async function handleTransaction(e) {
    e.preventDefault();
    if (contaBancaria.includes(Number(inputConta))) {
      const transactionRef = await addDoc(transactionCollectionRef, {
        valor: valor,
        contaBancariaDestinario: inputConta,
      },
      );
      if(valor > userSaldo) {
        alert('Saldo insuficiente para realizar a transação')
      } else {
        const novoSaldo = userSaldo - valor 
        setUserSaldo(novoSaldo);
        setSaldoAtual(novoSaldo);
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
        saldo: novoSaldo
      })
      localStorage.setItem('saldo', novoSaldo); 
        alert('Transação efetuada com sucesso')
      }
      
      const destinatarioQuery = query(collection(db, 'users'), where('contaBancaria', '==', Number(inputConta)));
      const destinatarioDocs = await getDocs(destinatarioQuery);

      if (!destinatarioDocs.empty) {
        const destinatarioDoc = destinatarioDocs.docs[0];
        const destinatarioDocRef = doc(db, 'users', destinatarioDoc.id);

        // Recuperar o saldo atual do destinatário
        const destinatarioSaldoAtual = destinatarioDoc.data().saldo;

        // Calcular e atualizar o novo saldo do destinatário
        const novoSaldoDestinatario = destinatarioSaldoAtual + Number(valor);

        // Atualizar o saldo do destinatário no banco de dados
        await updateDoc(destinatarioDocRef, {
          saldo: novoSaldoDestinatario,
        });

  } 
    resetInputs();
  } else {
    alert('Algo deu errado, verifique novamente as informações')
  }
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