package com.barbearia.app.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
  private final Key secretKey;
  private final long expirationTime;
  private final long refreshExpirationTime;

  public JwtUtil(
      @Value("${jwt.secret-key}") String secretKeyString,
      @Value("${jwt.expiration-time:86400000}") long expirationTime) {
    // Garante que a chave tenha pelo menos 256 bits (32 bytes)
    byte[] keyBytes = secretKeyString.getBytes(StandardCharsets.UTF_8);
    if (keyBytes.length < 32) {
      // Se a chave for muito curta, gera uma chave derivada
      this.secretKey = Keys.hmacShaKeyFor(
          String.format("%-32s", secretKeyString).replace(' ', '0').getBytes(StandardCharsets.UTF_8));
    } else {
      this.secretKey = Keys.hmacShaKeyFor(keyBytes);
    }
    this.expirationTime = expirationTime;
    this.refreshExpirationTime = expirationTime * 7; // 7x o tempo do token normal
  }

  public String generateToken(String subject) {
    return Jwts.builder()
        .setSubject(subject)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
        .signWith(secretKey)
        .compact();
  }

  public String generateRefreshToken(String subject) {
    return Jwts.builder()
        .setSubject(subject)
        .setIssuedAt(new Date())
        .setExpiration(new Date(System.currentTimeMillis() + refreshExpirationTime))
        .signWith(secretKey)
        .compact();
  }

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public String extractEmail(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public boolean isTokenValid(String token, String username) {
    return (username.equals(extractUsername(token)) && !isTokenExpired(token));
  }

  public boolean isRefreshTokenValid(String refreshToken, String email) {
    return (email.equals(extractEmail(refreshToken)) && !isTokenExpired(refreshToken));
  }

  private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = Jwts.parserBuilder()
        .setSigningKey(secretKey)
        .build()
        .parseClaimsJws(token)
        .getBody();
    return claimsResolver.apply(claims);
  }
}
