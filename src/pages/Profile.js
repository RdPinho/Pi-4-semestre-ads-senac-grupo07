import React from "react";
import "../styles/global.css";
import "../styles/profile.css";
import { Item } from "../components/Item";

function Profile() {
  return (
    <div className="profile-container">
      <div>
        <h2>Bem vindo,</h2> 
        <span className="highlight">Cliente</span>
        <div className="card">
          <h3>Horários Agendados</h3>
          <Item label="Dia" value={"05/07/2025"}/>
          <Item label="Hora" value={"10:00"}/>
          <Item label="Nome" value={"Juca Silva"}/>
          <button className="btn">Agendar</button>
          <button className="btn btn-danger">Excluir agendamento</button>
        </div>
      </div>

        
      <div>
        <div className="logo">BARBAER7</div>      
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
    </div>
  );
}

export default Profile;