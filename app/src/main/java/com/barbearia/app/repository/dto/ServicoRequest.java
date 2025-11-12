package com.barbearia.app.repository.dto;

import com.barbearia.app.model.Servico;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ServicoRequest {
  private String nome;
  private String descricao;
  private BigDecimal preco;
  private int duracaoMinutos;
  private String profissionalId; // ID do profissional que oferece este serviço

  public Servico toServico() {
    Servico servico = new Servico();
    servico.setNome(this.nome);
    servico.setDescricao(this.descricao);
    servico.setPreco(this.preco);
    servico.setDuracaoMinutos(this.duracaoMinutos);
    servico.setProfissionalId(this.profissionalId);
    return servico;
  }
}
