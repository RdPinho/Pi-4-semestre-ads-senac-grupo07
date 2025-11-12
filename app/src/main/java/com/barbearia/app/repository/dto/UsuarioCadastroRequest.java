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
public class UsuarioCadastroRequest {
  @NotBlank(message = "Nome não pode ser vazio")
  private String nome;
  @NotBlank(message = "Email não pode ser vazio")
  @Email
  private String email;
  @NotBlank(message = "Telefone não pode ser vazio")
  private String telefone;
  @NotBlank(message = "Senha não pode ser vazia")
  private String senha;
  @NotBlank(message = "Tipo de usuário não pode ser vazio")
  private String tipo;
}
