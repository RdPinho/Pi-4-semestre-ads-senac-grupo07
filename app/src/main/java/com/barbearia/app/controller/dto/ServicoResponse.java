package com.barbearia.app.controller.dto;

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
public class ServicoResponse {
  private String id;
  private String nome;
  private String descricao;
  private BigDecimal preco;
  private int duracaoMinutos;
  private String[] horariosDisponiveis;
  private String profissionalId;
  private String profissionalNome;
  private boolean disponivel;

  public static ServicoResponse fromServico(Servico servico) {
    ServicoResponse response = new ServicoResponse();
    response.setId(servico.getId());
    response.setNome(servico.getNome());
    response.setDescricao(servico.getDescricao());
    response.setPreco(servico.getPreco());
    response.setDuracaoMinutos(servico.getDuracaoMinutos());
    response.setHorariosDisponiveis(servico.getHorariosDisponiveis());
    response.setProfissionalId(servico.getProfissionalId());
    response.setDisponivel(servico.isDisponivel());
    return response;
  }
}
