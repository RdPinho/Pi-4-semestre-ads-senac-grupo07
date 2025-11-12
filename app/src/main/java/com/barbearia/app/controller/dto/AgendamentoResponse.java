package com.barbearia.app.controller.dto;

import com.barbearia.app.model.Agendamento;
import com.barbearia.app.model.Servico;
import com.barbearia.app.model.Usuario;
import com.barbearia.app.model.enums.StatusAgendamento;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AgendamentoResponse {
  private String id;
  private String usuarioId;
  private String profissionalId;
  private String servicoId;
  private LocalDateTime dataHora;
  private StatusAgendamento status;

  // Dados expandidos (opcionais)
  private ServicoInfo servico;
  private UsuarioInfo cliente;
  private UsuarioInfo profissional;

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ServicoInfo {
    private String id;
    private String nome;
    private String descricao;
    private java.math.BigDecimal preco;
    private Integer duracaoMinutos;
  }

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class UsuarioInfo {
    private String id;
    private String nome;
    private String email;
    private String telefone;
  }

  public static AgendamentoResponse fromAgendamento(Agendamento agendamento) {
    AgendamentoResponse response = new AgendamentoResponse();
    response.setId(agendamento.getId());
    response.setUsuarioId(agendamento.getUsuarioId());
    response.setProfissionalId(agendamento.getProfissionalId());
    response.setServicoId(agendamento.getServicoId());
    response.setDataHora(agendamento.getDataHora());
    response.setStatus(agendamento.getStatus());
    return response;
  }

  public static AgendamentoResponse fromAgendamentoCompleto(
      Agendamento agendamento, Usuario cliente, Usuario profissional, Servico servico) {
    AgendamentoResponse response = fromAgendamento(agendamento);

    if (servico != null) {
      response.setServico(
          new ServicoInfo(
              servico.getId(),
              servico.getNome(),
              servico.getDescricao(),
              servico.getPreco(),
              servico.getDuracaoMinutos()));
    }

    if (cliente != null) {
      response.setCliente(
          new UsuarioInfo(
              cliente.getId(), cliente.getNome(), cliente.getEmail(), cliente.getTelefone()));
    }

    if (profissional != null) {
      response.setProfissional(
          new UsuarioInfo(
              profissional.getId(),
              profissional.getNome(),
              profissional.getEmail(),
              profissional.getTelefone()));
    }

    return response;
  }
}
