package com.barbearia.app.config;

import com.barbearia.app.utils.JwtUtil;
import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.ReactiveAuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.AuthenticationWebFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

  private final JwtAuthenticationConverter jwtAuthenticationConverter;
  private final JwtUtil jwtUtil;

  public SecurityConfig(JwtAuthenticationConverter jwtAuthenticationConverter, JwtUtil jwtUtil) {
    this.jwtAuthenticationConverter = jwtAuthenticationConverter;
    this.jwtUtil = jwtUtil;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("http://localhost:4200"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    config.setExposedHeaders(List.of("Authorization"));
    config.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
  }

  @Bean
  public ReactiveAuthenticationManager reactiveAuthenticationManager() {
    return authentication -> {
      String token = (String) authentication.getPrincipal();
      String username = jwtUtil.extractUsername(token);
      if (username != null && jwtUtil.isTokenValid(token, username)) {
        return Mono.just(
            new UsernamePasswordAuthenticationToken(username, null, List.of(new SimpleGrantedAuthority("ROLE_USER"))));
      }
      return Mono.empty();
    };
  }

  @Bean
  public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
    AuthenticationWebFilter jwtFilter = new AuthenticationWebFilter(reactiveAuthenticationManager());
    jwtFilter.setServerAuthenticationConverter(jwtAuthenticationConverter);

    return http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .authorizeExchange(
            auth -> auth
                .pathMatchers("/swagger-ui/**", "/v3/api-docs/**", "/webjars/**").permitAll()
                .pathMatchers("/api/auth/login", "/api/auth/register", "/api/auth/refresh").permitAll()
                .anyExchange().authenticated())
        .addFilterAt(jwtFilter, SecurityWebFiltersOrder.AUTHENTICATION)
        .build();
  }
}
