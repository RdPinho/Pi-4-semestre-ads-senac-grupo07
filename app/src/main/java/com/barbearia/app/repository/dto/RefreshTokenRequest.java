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
public class RefreshTokenRequest {
  @NotBlank(message = "Refresh token não pode ser vazio")
  private String refreshToken;
}
