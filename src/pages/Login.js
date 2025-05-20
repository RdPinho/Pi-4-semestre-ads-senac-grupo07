// src/pages/Login.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate('/Profile');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, backgroundColor: '#312E38', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontFamily: 'Inknut Antiqua', fontWeight: 400, fontSize: 48, color: 'white', marginBottom: 40 }}>
          BARBER7
        </h1>
        <div className="container">
          <h2 style={{ fontFamily: 'Arial', fontWeight: 400, fontSize: 32, color: 'white', textAlign: 'center', marginBottom: 24 }}>
            Faça seu Login
          </h2>
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button className="button" onClick={handleLogin}>Entrar</button>
          <Link style={{ color: "#fff" }} to="/forgot">Esqueci Minha Senha</Link>
          <Link to="/register" style={{ marginTop: 32 }}>Criar Conta</Link>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <img
          src={require('../assets/image 1.png')}
          alt="Barbearia"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}
