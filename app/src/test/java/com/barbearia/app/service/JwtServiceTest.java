package com.barbearia.app.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

  private JwtService jwtService;

  @BeforeEach
  void setUp() {
    jwtService = new JwtService();
    // Setando valores das propriedades manualmente
    jwtService.expirationTime = 1000L * 60 * 60; // 1 hora
    jwtService.secretKey = "12345678901234567890123456789012"; // 32 chars para HS256
  }

  @Test
  void deveGerarTokenValido() {
    String email = "teste@email.com";
    String token = jwtService.gerarToken(email);
    assertNotNull(token);
    assertTrue(token.length() > 0);
    assertTrue(jwtService.validarToken(token));
  }

  @Test
  void deveRetornarFalseParaTokenInvalido() {
    String tokenInvalido = "token.invalido";
    assertFalse(jwtService.validarToken(tokenInvalido));
  }

  @Test
  void tokenGeradoDeveConterEmailComoSubject() {
    String email = "subject@email.com";
    String token = jwtService.gerarToken(email);
    var claims = io.jsonwebtoken.Jwts.parserBuilder()
        .setSigningKey(jwtService.getSigningKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
    assertEquals(email, claims.getSubject());
  }
}

