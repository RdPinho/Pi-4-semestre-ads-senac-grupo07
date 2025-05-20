import React from 'react';

export default function Appointment({ date, time, service }) {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center' }}>
        <h1>Agendamento Confirmado</h1>
        <p style={{ margin: '12px 0' }}><strong>Data:</strong> {date}</p>
        <p style={{ margin: '12px 0' }}><strong>Hora:</strong> {time}</p>
        <p style={{ margin: '12px 0' }}><strong>Serviço:</strong> {service}</p>
      </div>
    </div>
  );
};

