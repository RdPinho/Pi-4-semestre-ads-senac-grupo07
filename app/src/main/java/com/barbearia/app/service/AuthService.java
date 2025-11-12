package com.barbearia.app.service;

import com.barbearia.app.controller.dto.request.RegisterRequest;
import com.barbearia.app.exception.CredenciaisInvalidasException;
import com.barbearia.app.exception.EmailJaCadastradoException;
import com.barbearia.app.model.Usuario;
import com.barbearia.app.repository.UsuarioRepository;
import com.barbearia.app.repository.dto.LoginRequest;
import com.barbearia.app.repository.dto.LoginResponse;
import com.barbearia.app.utils.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

@Service
public class AuthService {

  private final UsuarioRepository usuarioRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;

  public AuthService(
      UsuarioRepository usuarioRepository,
      PasswordEncoder passwordEncoder,
      JwtUtil jwtUtil) {
    this.usuarioRepository = usuarioRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
  }

  public Mono<LoginResponse> register(RegisterRequest request) {
    request.setSenha(passwordEncoder.encode(request.getSenha()));

    // Valida o tipo
    if (!"CLIENTE".equalsIgnoreCase(request.getRole()) && !"PROFISSIONAL".equalsIgnoreCase(request.getRole())) {
      return Mono.error(new IllegalArgumentException("Role inválido. Use 'CLIENTE' ou 'PROFISSIONAL'"));
    }

    // Cria usuário na tabela unificada 'usuarios'
    Usuario usuario = new Usuario();
    usuario.setNome(request.getNome());
    usuario.setEmail(request.getEmail());
    usuario.setTelefone(request.getTelefone());
    usuario.setSenha(request.getSenha()); // já está encodada
    usuario.setTipo(request.getRole().toUpperCase());

    return usuarioRepository
        .findByEmail(request.getEmail())
        .flatMap(existing -> Mono.<Usuario>error(new EmailJaCadastradoException("Email já cadastrado")))
        .switchIfEmpty(Mono.defer(() -> usuarioRepository.save(usuario)))
        .map(savedUsuario -> {
          String token = jwtUtil.generateToken(savedUsuario.getEmail());
          String refreshToken = jwtUtil.generateRefreshToken(savedUsuario.getEmail());
          return new LoginResponse(token, refreshToken, savedUsuario);
        });
  }

  public Mono<LoginResponse> login(LoginRequest loginRequest) {
    // Busca usuário na tabela unificada 'usuarios'
    return usuarioRepository
        .findByEmail(loginRequest.getEmail())
        .filter(u -> passwordEncoder.matches(loginRequest.getSenha(), u.getSenha()))
        .map(u -> {
          String token = jwtUtil.generateToken(u.getEmail());
          String refreshToken = jwtUtil.generateRefreshToken(u.getEmail());
          return new LoginResponse(token, refreshToken, u);
        })
        .switchIfEmpty(Mono.error(new CredenciaisInvalidasException("Email ou senha incorretos")));
  }

  public Mono<LoginResponse> refreshToken(String refreshToken) {
    try {
      String email = jwtUtil.extractEmail(refreshToken);

      if (jwtUtil.isRefreshTokenValid(refreshToken, email)) {
        // Busca o usuário na tabela unificada 'usuarios'
        return usuarioRepository
            .findByEmail(email)
            .map(usuario -> {
              String newToken = jwtUtil.generateToken(email);
              String newRefreshToken = jwtUtil.generateRefreshToken(email);
              return new LoginResponse(newToken, newRefreshToken, usuario);
            })
            .switchIfEmpty(Mono.error(new CredenciaisInvalidasException("Usuário não encontrado")));
      } else {
        return Mono.error(new CredenciaisInvalidasException("Refresh token inválido ou expirado"));
      }
    } catch (Exception e) {
      return Mono.error(new CredenciaisInvalidasException("Refresh token inválido"));
    }
  }
}
