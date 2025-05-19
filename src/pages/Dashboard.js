import React from "react";
import "../styles/global.css";

function Dashboard() {
  return (
    <div className="container">
      <h2>Bem vindo, <span className="highlight">Juca Silva</span></h2>

      <div className="card">
        <h3>Horários Agendados - Dia 06</h3>
        <ul>
          <li>10:00 - Rodrigo de Pinho</li>
          <li>16:00 - Estevão Menezes</li>
          <li>18:00 - Marcus Vinicius</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
