package com.barbearia.app.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import com.barbearia.app.model.Usuario;
import com.barbearia.app.repository.dto.LoginRequest;
import com.barbearia.app.repository.dto.LoginResponse;
import com.barbearia.app.repository.dto.UsuarioCadastroRequest;
import com.barbearia.app.service.UsuarioService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

class UsuarioControllerTest {

  @Mock private UsuarioService usuarioService;

  @InjectMocks private UsuarioController usuarioController;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

//  @Nested
//  class CadastrarUsuarioTest {
//    @Test
//    void deveCadastrarUsuarioComSucesso() {
//      UsuarioCadastroRequest request = new UsuarioCadastroRequest();
//      Usuario usuario = new Usuario();
//      usuario.setId("1");
//      usuario.setNome("Fulano");
//      when(usuarioService.cadastrarUsuario(any(UsuarioCadastroRequest.class)))
//          .thenReturn(Mono.just(usuario));
//
//      Mono<Usuario> result = usuarioController.cadastrarUsuario(request);
//      StepVerifier.create(result)
//          .expectNextMatches(u -> u.getId().equals("1") && u.getNome().equals("Fulano"))
//          .verifyComplete();
//    }
//  }
//
//  @Nested
//  class LoginTest {
//    @Test
//    void deveLogarComSucesso() {
//      LoginRequest loginRequest = new LoginRequest();
//      LoginResponse loginResponse = new LoginResponse();
//      loginResponse.setToken("token123");
//      when(usuarioService.login(any(LoginRequest.class))).thenReturn(Mono.just(loginResponse));
//
//      Mono<ResponseEntity<LoginResponse>> result = usuarioController.login(loginRequest);
//      StepVerifier.create(result)
//          .expectNextMatches(
//              response -> {
//                Assertions.assertNotNull(response.getBody());
//                return response.getBody().getToken().equals("token123")
//                    && response.getStatusCode().is2xxSuccessful();
//              })
//          .verifyComplete();
//    }
//
//    @Test
//    void deveRetornarUnauthorizedNoLoginInvalido() {
//      LoginRequest loginRequest = new LoginRequest();
//      when(usuarioService.login(any(LoginRequest.class)))
//          .thenReturn(Mono.error(new RuntimeException("Credenciais inválidas")));
//
//      Mono<ResponseEntity<LoginResponse>> result = usuarioController.login(loginRequest);
//      StepVerifier.create(result)
//          .expectNextMatches(response -> response.getStatusCode().is4xxClientError())
//          .verifyComplete();
//    }
//  }
//
//  @Nested
//  class ListarUsuariosTest {
//    @Test
//    void deveListarUsuarios() {
//      Usuario usuario1 = new Usuario();
//      usuario1.setId("1");
//      usuario1.setNome("Fulano");
//      Usuario usuario2 = new Usuario();
//      usuario2.setId("2");
//      usuario2.setNome("Beltrano");
//      when(usuarioService.buscarUsuariosPorTipo(anyString())).thenReturn(Flux.just(usuario1, usuario2));
//
//      Flux<Usuario> result = usuarioController.listarUsuarios("ADMIN");
//      StepVerifier.create(result).expectNext(usuario1).expectNext(usuario2).verifyComplete();
//    }
//  }
}
