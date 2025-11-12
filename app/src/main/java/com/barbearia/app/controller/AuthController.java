package com.barbearia.app.controller;

import com.barbearia.app.controller.dto.response.ApiResponse;
import com.barbearia.app.controller.dto.request.RegisterRequest;
import com.barbearia.app.repository.dto.LoginRequest;
import com.barbearia.app.repository.dto.LoginResponse;
import com.barbearia.app.repository.dto.RefreshTokenRequest;
import com.barbearia.app.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@Validated
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticação", description = "Operações relacionadas à autenticação de usuários")
public class AuthController {

  private final AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  @Operation(summary = "Cadastrar novo usuário", description = "Endpoint para cadastrar um novo usuário (cliente ou profissional) no sistema")
  public Mono<ResponseEntity<ApiResponse<LoginResponse>>> register(
      @Valid @RequestBody RegisterRequest request) {
    return authService
        .register(request)
        .map(loginResponse -> ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(loginResponse, "Usuário cadastrado com sucesso")))
        .onErrorResume(e -> Mono.just(
            ResponseEntity
                .badRequest()
                .body(ApiResponse.error(e.getMessage()))));
  }

  @PostMapping("/login")
  @Operation(summary = "Login de usuário", description = "Endpoint para autenticar um usuário e obter tokens JWT")
  public Mono<ResponseEntity<ApiResponse<LoginResponse>>> login(
      @Valid @RequestBody LoginRequest loginRequest) {
    return authService
        .login(loginRequest)
        .map(loginResponse -> ResponseEntity.ok(ApiResponse.success(loginResponse, "Login realizado com sucesso")))
        .onErrorResume(e -> Mono.just(
            ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(e.getMessage()))));
  }

  @PostMapping("/refresh")
  @Operation(summary = "Renovar token", description = "Endpoint para renovar o access token usando o refresh token")
  public Mono<ResponseEntity<ApiResponse<LoginResponse>>> refresh(
      @Valid @RequestBody RefreshTokenRequest request) {
    return authService
        .refreshToken(request.getRefreshToken())
        .map(loginResponse -> ResponseEntity.ok(ApiResponse.success(loginResponse, "Token renovado com sucesso")))
        .onErrorResume(e -> Mono.just(
            ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(e.getMessage()))));
  }

  @PostMapping("/logout")
  @Operation(summary = "Logout de usuário", description = "Endpoint para invalidar o refresh token do usuário")
  public Mono<ResponseEntity<ApiResponse<Void>>> logout(
      @Valid @RequestBody RefreshTokenRequest request) {
    // Aqui você pode implementar a lógica para invalidar o refresh token
    // Por exemplo, adicionar em uma blacklist no Redis
    return Mono.just(
        ResponseEntity.ok(ApiResponse.success(null, "Logout realizado com sucesso")));
  }
}
