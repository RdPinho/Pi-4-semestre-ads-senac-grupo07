package com.barbearia.app.controller.dto.request;

import com.barbearia.app.model.Cliente;
import com.barbearia.app.model.Profissional;
import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RegisterRequest {
  @NotBlank(message = "Nome não pode ser vazio")
  private String nome;

  @NotBlank(message = "Email não pode ser vazio")
  @Email(message = "Email inválido")
  private String email;

  @NotBlank(message = "Telefone não pode ser vazio")
  private String telefone;

  @NotBlank(message = "Senha não pode ser vazia")
  private String senha;

  @NotBlank(message = "Role não pode ser vazio")
  private String role; // "CLIENTE" ou "PROFISSIONAL"

  // Campos específicos para Cliente
  private String[] preferenciasPagamento;
  private Integer pontosFidelidade;

  // Campos específicos para Profissional
  private String[] especialidade;
  private Boolean ativo;

  public Cliente toCliente() {
    return new Cliente(
        null,
        this.nome,
        this.email,
        this.telefone,
        this.senha,
        "CLIENTE",
        this.preferenciasPagamento != null ? this.preferenciasPagamento : new String[0],
        this.pontosFidelidade != null ? this.pontosFidelidade : 0);
  }

  public Profissional toProfissional() {
    return new Profissional(
        null,
        this.nome,
        this.email,
        this.telefone,
        this.senha,
        "PROFISSIONAL",
        this.especialidade != null ? this.especialidade : new String[0],
        this.ativo != null ? this.ativo : true);
  }
}
