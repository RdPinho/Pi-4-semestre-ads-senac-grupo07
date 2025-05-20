import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import bgImage from '../assets/image.png';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    telefone: '',
    email: '',
    senha: '',
    confirmarSenha: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.senha,
      options: {
        data: {
          nome: formData.nome,
          sobrenome: formData.sobrenome,
          telefone: formData.telefone,
        },
      },
    });

    if (error) {
      setError('Erro ao cadastrar. Verifique os dados.');
    } else {
      setSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => navigate('/'), 2000);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#1f1b28',
      }}
    >
      {/* Lado esquerdo - título fixo no topo */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontFamily: 'Arial, sans-serif',
          fontSize: '24px',
          color: '#FFFFFF',
          fontWeight: 'bold',
        }}
      >
        Cadastro
      </div>

      {/* Imagem de fundo centralizada */}
      <div
        style={{
          flex: 1,
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Formulário transparente sobreposto */}
        <form
          onSubmit={handleRegister}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            width: '300px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: '20px',
            borderRadius: '8px',
            color: '#fff',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          {['nome', 'sobrenome', 'telefone', 'email', 'senha', 'confirmarSenha'].map((field, idx) => (
            <input
              key={idx}
              type={field.includes('senha') ? 'password' : field === 'email' ? 'email' : 'text'}
              name={field}
              placeholder={
                field === 'confirmarSenha'
                  ? 'Confirme sua senha'
                  : field.charAt(0).toUpperCase() + field.slice(1)
              }
              value={formData[field]}
              onChange={handleChange}
              required
              style={{
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '14px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#fff',
              }}
            />
          ))}

          {error && <p style={{ color: '#f87171', fontSize: '14px' }}>{error}</p>}
          {success && <p style={{ color: '#4ade80', fontSize: '14px' }}>{success}</p>}

          <button
            type="submit"
            style={{
              marginTop: '12px',
              padding: '10px',
              backgroundColor: '#F59E0B',
              border: 'none',
              borderRadius: '6px',
              color: '#000',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
