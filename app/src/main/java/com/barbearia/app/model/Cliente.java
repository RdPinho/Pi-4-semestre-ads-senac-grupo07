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
@Document(collection = "clientes")
public class Cliente extends Usuario {
  private String[] preferenciasPagamento;
  private int pontosFidelidade;

  public Cliente(
      String id,
      String nome,
      String email,
      String telefone,
      String senha,
      String tipo,
      String[] preferenciasPagamento,
      int pontosFidelidade) {
    super(id, nome, email, telefone, senha, tipo);
    this.preferenciasPagamento = preferenciasPagamento;
    this.pontosFidelidade = pontosFidelidade;
  }
}
