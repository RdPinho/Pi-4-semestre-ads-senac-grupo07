package com.barbearia.app.exception.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ErrorResponse {
  private String codigo;
  private String mensagem;
  private String timestamp;

  public ErrorResponse(String codigo, String mensagem) {
    this.codigo = codigo;
    this.mensagem = mensagem;
    this.timestamp = java.time.LocalDateTime.now().toString();
  }
}
