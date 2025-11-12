package com.barbearia.app.service;

import com.barbearia.app.model.Usuario;
import com.barbearia.app.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Service
public class UsuarioService {

  private final UsuarioRepository usuarioRepository;

  public UsuarioService(UsuarioRepository usuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  public Flux<Usuario> listarUsuarios() {
    return usuarioRepository.findAll();
  }

  public Flux<Usuario> buscarUsuariosPorTipo(String tipo) {
    if (tipo == null) {
      return usuarioRepository.findAll();
    } else {
      return usuarioRepository.findByTipo(tipo);
    }
  }
}
