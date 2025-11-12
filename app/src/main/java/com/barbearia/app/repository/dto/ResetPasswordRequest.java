package com.barbearia.app.repository.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ResetPasswordRequest {
  @NotBlank(message = "Token não pode ser vazio")
  private String token;

  @NotBlank(message = "Nova senha não pode ser vazia")
  private String newPassword;
}
