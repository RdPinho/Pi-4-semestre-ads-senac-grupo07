import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // Aqui você pode cadastrar o usuário
    navigate('/');
  };

  return (
    <div className="container">
      <h1>Cadastro</h1>
      <form onSubmit={handleRegister}>
        <input className="input" type="text" placeholder="Nome" required />
        <input className="input" type="text" placeholder="Sobrenome" required />
        <input className="input" type="tel" placeholder="Telefone (xx) xxxxx-xxxx" required />
        <input className="input" type="email" placeholder="Email" required />
        <input className="input" type="password" placeholder="Senha" required />
        <input className="input" type="password" placeholder="Confirme sua senha" required />
        <button className="button" type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Register;
