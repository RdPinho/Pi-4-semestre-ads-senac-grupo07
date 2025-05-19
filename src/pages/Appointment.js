import React from 'react';
import { useDispatch } from 'react-redux';
import { setServico } from '../store/appointmentSlice';
import { useNavigate } from 'react-router-dom';

const Agendamento = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const servicos = ['Corte Masculino', 'Barba', 'Combo Corte + Barba', 'Sobrancelha'];

  const handleSelecionar = (servico) => {
    dispatch(setServico(servico));
    navigate('/confirmacao');
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Escolha o Serviço</h2>
      <ul className="space-y-4">
        {servicos.map((servico, idx) => (
          <li key={idx}>
            <button
              onClick={() => handleSelecionar(servico)}
              className="w-full py-2 px-4 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700"
            >
              {servico}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Agendamento;
