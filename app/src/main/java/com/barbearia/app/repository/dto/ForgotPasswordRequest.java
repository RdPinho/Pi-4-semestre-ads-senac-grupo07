package com.barbearia.app.repository.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ForgotPasswordRequest {
  @NotBlank(message = "Email não pode ser vazio")
  @Email(message = "Email inválido")
  private String email;
}
