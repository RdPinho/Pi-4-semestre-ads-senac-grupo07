import React from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // aqui você pode fazer chamada à API
    navigate('/profile');
  };

  return (
    <div className="container">
      <h1>BARBER7</h1>
      <form onSubmit={handleLogin}>
        <input className="input" type="email" placeholder="Email" required />
        <input className="input" type="password" placeholder="Senha" required />
        <button className="button" type="submit">Entrar</button>
        <a href="#">Esqueci Minha Senha</a>
        <a href="/register">Criar Conta</a>
      </form>
    </div>
  );
};

export default Login;
