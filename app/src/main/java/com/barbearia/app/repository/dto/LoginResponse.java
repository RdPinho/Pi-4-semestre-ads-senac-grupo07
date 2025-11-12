package com.barbearia.app.repository.dto;

import com.barbearia.app.model.Usuario;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LoginResponse {
  private String token;
  private String refreshToken;
  private Usuario usuario;

  public LoginResponse(String token, Usuario usuario) {
    this.token = token;
    this.usuario = usuario;
  }
}
