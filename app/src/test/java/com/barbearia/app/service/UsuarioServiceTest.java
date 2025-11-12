package com.barbearia.app.service;

import com.barbearia.app.model.Usuario;
import com.barbearia.app.repository.UsuarioRepositoryClient;
import com.barbearia.app.repository.dto.LoginRequest;
import com.barbearia.app.repository.dto.LoginResponse;
import com.barbearia.app.repository.dto.UsuarioCadastroRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

class UsuarioServiceTest {

  @Mock
  private UsuarioRepositoryClient usuarioRepository;
  @Mock
  private PasswordEncoder passwordEncoder;
  @Mock
  private JwtService jwtService;

  @InjectMocks
  private UsuarioService usuarioService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }
//
//  @Test
//  void deveCadastrarUsuarioComSenhaCodificada() {
//    UsuarioCadastroRequest request = new UsuarioCadastroRequest();
//    request.setSenha("123456");
//    Usuario usuario = new Usuario();
//    usuario.setId("1");
//    usuario.setNome("Fulano");
//    when(passwordEncoder.encode(anyString())).thenReturn("senhaCodificada");
//    when(usuarioRepository.cadastrarUsuario(any(UsuarioCadastroRequest.class))).thenReturn(Mono.just(usuario));
//
//    Mono<Usuario> result = usuarioService.cadastrarUsuario(request);
//    StepVerifier.create(result)
//        .expectNextMatches(u -> u.getId().equals("1") && u.getNome().equals("Fulano"))
//        .verifyComplete();
//  }
//
//  @Test
//  void deveLogarComSucesso() {
//    LoginRequest loginRequest = new LoginRequest();
//    loginRequest.setEmail("fulano@email.com");
//    loginRequest.setSenha("123456");
//    Usuario usuario = new Usuario();
//    usuario.setEmail("fulano@email.com");
//    usuario.setSenha("senhaCodificada");
//    when(usuarioRepository.buscarPorEmail(anyString())).thenReturn(Mono.just(usuario));
//    when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);
//    when(jwtService.gerarToken(anyString())).thenReturn("token123");
//
//    Mono<LoginResponse> result = usuarioService.login(loginRequest);
//    StepVerifier.create(result)
//        .expectNextMatches(r -> r.getToken().equals("token123") && r.getUsuario().getEmail().equals("fulano@email.com"))
//        .verifyComplete();
//  }
//
//  @Test
//  void deveFalharLoginCredenciaisInvalidas() {
//    LoginRequest loginRequest = new LoginRequest();
//    loginRequest.setEmail("fulano@email.com");
//    loginRequest.setSenha("errada");
//    Usuario usuario = new Usuario();
//    usuario.setEmail("fulano@email.com");
//    usuario.setSenha("senhaCodificada");
//    when(usuarioRepository.buscarPorEmail(anyString())).thenReturn(Mono.just(usuario));
//    when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);
//
//    Mono<LoginResponse> result = usuarioService.login(loginRequest);
//    StepVerifier.create(result)
//        .expectErrorMatches(e -> e instanceof RuntimeException && e.getMessage().equals("Credenciais inválidas"))
//        .verify();
//  }
//
//  @Test
//  void deveBuscarUsuariosPorTipo() {
//    Usuario usuario1 = new Usuario();
//    usuario1.setId("1");
//    usuario1.setNome("Fulano");
//    Usuario usuario2 = new Usuario();
//    usuario2.setId("2");
//    usuario2.setNome("Beltrano");
//    when(usuarioRepository.listarUsuarios(anyString())).thenReturn(Flux.just(usuario1, usuario2));
//
//    Flux<Usuario> result = usuarioService.buscarUsuariosPorTipo("ADMIN");
//    StepVerifier.create(result)
//        .expectNext(usuario1)
//        .expectNext(usuario2)
//        .verifyComplete();
//  }
}
