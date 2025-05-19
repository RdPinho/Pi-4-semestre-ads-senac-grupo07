import React from "react";
import "../styles/global.css";

function Profile() {
  return (
    <div className="container">
      <h2>Bem vindo, <span className="highlight">Cliente</span></h2>

      <div className="card">
        <h3>Horários Agendados</h3>
        <input type="text" placeholder="Dia" defaultValue="06-05-2025" />
        <input type="text" placeholder="Hora" defaultValue="10:00" />
        <input type="text" placeholder="Barbeiro" defaultValue="Juca Silva" />
        <button className="btn">Agendar</button>
        <button className="btn btn-danger">Excluir agendamento</button>
      </div>

      <div className="card">
        <h3>Atualizar Perfil</h3>
        <input type="text" placeholder="Nome" />
        <input type="email" placeholder="Email" />
        <input type="text" placeholder="Telefone" />
        <input type="password" placeholder="Senha Atual" />
        <input type="password" placeholder="Nova Senha" />
        <input type="password" placeholder="Confirme sua senha" />
        <button className="btn">Confirma Mudanças</button>
      </div>
    </div>
  );
}

export default Profile;