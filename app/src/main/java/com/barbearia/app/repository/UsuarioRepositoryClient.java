package com.barbearia.app.repository;

import com.barbearia.app.model.Usuario;
import com.barbearia.app.repository.dto.LoginRequest;
import com.barbearia.app.repository.dto.LoginResponse;
import com.barbearia.app.repository.dto.UsuarioCadastroRequest;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public class UsuarioRepositoryClient {

  private final WebClient webClient;

  @Autowired
  public UsuarioRepositoryClient(WebClient.Builder webClientBuilder) {
    this.webClient = webClientBuilder.baseUrl("http://localhost:3009").build();
  }

  public Mono<Usuario> cadastrarUsuario(UsuarioCadastroRequest usuario) {
    return webClient
        .post()
        .uri("/usuarios")
        .bodyValue(usuario)
        .retrieve()
        .bodyToMono(Usuario.class);
  }

  public Mono<Usuario> buscarPorEmail(String email) {
    return webClient
        .get()
        .uri(uriBuilder -> uriBuilder.path("/usuarios").queryParam("email", email).build())
        .retrieve()
        .bodyToFlux(Usuario.class)
        .next(); // Pega o primeiro usuário encontrado
  }

  public Mono<LoginResponse> login(LoginRequest loginRequest) {
    return webClient
        .post()
        .uri("/auth/login")
        .bodyValue(loginRequest)
        .retrieve()
        .bodyToMono(LoginResponse.class);
  }

  public Flux<Usuario> listarUsuarios(String tipo) {
    return webClient
        .get()
        .uri(
            uriBuilder ->
                uriBuilder
                    .path("/usuarios")
                    .queryParamIfPresent("tipo", Optional.ofNullable(tipo))
                    .build())
        .retrieve()
        .bodyToFlux(Usuario.class);
  }
}
