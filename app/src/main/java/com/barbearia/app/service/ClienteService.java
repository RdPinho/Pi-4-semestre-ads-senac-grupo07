package com.barbearia.app.service;

import com.barbearia.app.model.Usuario;
import com.barbearia.app.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class ClienteService {
  private final UsuarioRepository usuarioRepository;

  public ClienteService(UsuarioRepository usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  public Flux<Usuario> listarClientes() {
    return usuarioRepository.findByTipo("CLIENTE");
  }
}
