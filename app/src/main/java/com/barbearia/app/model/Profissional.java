package com.barbearia.app.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document(collection = "profissionais")
public class Profissional extends Usuario {
  private String[] especialidade;
  private boolean ativo;

  public Profissional(
      String id,
      String nome,
      String email,
      String telefone,
      String senha,
      String tipo,
      String[] especialidade,
      boolean ativo) {
    super(id, nome, email, telefone, senha, tipo);
    this.especialidade = especialidade;
    this.ativo = ativo;
  }
}
