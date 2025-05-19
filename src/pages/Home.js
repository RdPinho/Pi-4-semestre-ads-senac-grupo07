import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-gray-100 to-gray-300">
      <h1 className="text-3xl font-bold mb-4">Bem-vindo à Barbearia Compass</h1>
      <p className="mb-6 text-center text-gray-700 max-w-md">
        Agende seu horário com facilidade. Escolha seu barbeiro, serviço e horário ideal em poucos cliques.
      </p>
      <button
        onClick={() => navigate('/agendamento')}
        className="px-6 py-2 bg-black text-white rounded-2xl shadow-md hover:bg-gray-800"
      >
        Agendar Agora
      </button>
    </div>
  );
}
