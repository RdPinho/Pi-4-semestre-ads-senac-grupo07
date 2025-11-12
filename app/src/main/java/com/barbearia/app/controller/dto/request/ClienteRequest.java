package com.barbearia.app.controller.dto.request;

import com.barbearia.app.model.Cliente;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ClienteRequest {
  private String nome;
  private String email;
  private String telefone;
  private String senha;
  private String[] preferenciasPagamento;
  private int pontosFidelidade;

  public Cliente toCliente() {
    Cliente cliente = new Cliente();
    cliente.setNome(this.nome);
    cliente.setEmail(this.email);
    cliente.setTelefone(this.telefone);
    cliente.setSenha(this.senha);
    cliente.setPreferenciasPagamento(this.preferenciasPagamento);
    cliente.setPontosFidelidade(this.pontosFidelidade);
    return cliente;
  }
}
