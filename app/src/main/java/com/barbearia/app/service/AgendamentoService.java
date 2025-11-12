package com.barbearia.app.service;

import com.barbearia.app.controller.dto.AgendamentoResponse;
import com.barbearia.app.model.Agendamento;
import com.barbearia.app.model.Servico;
import com.barbearia.app.model.Usuario;
import com.barbearia.app.model.enums.StatusAgendamento;
import com.barbearia.app.repository.AgendamentoRepository;
import com.barbearia.app.repository.ServicoRepository;
import com.barbearia.app.repository.UsuarioRepository;
import com.barbearia.app.repository.dto.AgendamentoRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class AgendamentoService {
  private final AgendamentoRepository agendamentoRepository;
  private final UsuarioRepository usuarioRepository;
  private final ServicoRepository servicoRepository;

  public AgendamentoService(
      AgendamentoRepository agendamentoRepository,
      UsuarioRepository usuarioRepository,
      ServicoRepository servicoRepository) {
    this.agendamentoRepository = agendamentoRepository;
    this.usuarioRepository = usuarioRepository;
    this.servicoRepository = servicoRepository;
  }

  public Mono<Agendamento> criarAgendamento(AgendamentoRequest request) {
    System.out.println("=== DEBUG: Criando agendamento ===");
    System.out.println("Request recebido: " + request);

    Agendamento agendamento = request.toAgendamento();

    System.out.println("Agendamento após conversão:");
    System.out.println("  usuarioId: " + agendamento.getUsuarioId());
    System.out.println("  profissionalId: " + agendamento.getProfissionalId());
    System.out.println("  servicoId: " + agendamento.getServicoId());
    System.out.println("  dataHora: " + agendamento.getDataHora());

    agendamento.setStatus(StatusAgendamento.PENDENTE);
    return agendamentoRepository.save(agendamento);
  }

  public Flux<Agendamento> listarAgendamentosPorProfissional(String id) {
    return agendamentoRepository.findByProfissionalId(id);
  }

  public Flux<Agendamento> listarAgendamentosPorUsuario(String usuarioId) {
    return agendamentoRepository.findByUsuarioId(usuarioId);
  }

  public Flux<Agendamento> listarAgendamentosPorUsuarioComStatus(
      String usuarioId, String statusList) {
    Flux<Agendamento> agendamentos = agendamentoRepository.findByUsuarioId(usuarioId);

    if (statusList != null && !statusList.isEmpty()) {
      String[] statusArray = statusList.split(",");
      return agendamentos.filter(
          agendamento -> {
            for (String status : statusArray) {
              try {
                StatusAgendamento requestedStatus = StatusAgendamento.valueOf(status.trim());
                if (StatusAgendamento.areEquivalent(agendamento.getStatus(), requestedStatus)) {
                  return true;
                }
              } catch (IllegalArgumentException e) {
                // Status inválido, ignorar
              }
            }
            return false;
          });
    }

    return agendamentos;
  }

  public Flux<Agendamento> listarAgendamentosPorProfissionalComStatus(
      String profissionalId, String statusList) {
    Flux<Agendamento> agendamentos = agendamentoRepository.findByProfissionalId(profissionalId);

    if (statusList != null && !statusList.isEmpty()) {
      String[] statusArray = statusList.split(",");
      return agendamentos.filter(
          agendamento -> {
            for (String status : statusArray) {
              try {
                StatusAgendamento requestedStatus = StatusAgendamento.valueOf(status.trim());
                if (StatusAgendamento.areEquivalent(agendamento.getStatus(), requestedStatus)) {
                  return true;
                }
              } catch (IllegalArgumentException e) {
                // Status inválido, ignorar
              }
            }
            return false;
          });
    }

    return agendamentos;
  }

  public Flux<Agendamento> listarTodosAgendamentos() {
    return agendamentoRepository.findAll();
  }

  public Mono<Agendamento> buscarAgendamentoPorId(String id) {
    return agendamentoRepository.findById(id);
  }

  public Mono<Agendamento> cancelarAgendamento(String id) {
    return agendamentoRepository
        .findById(id)
        .flatMap(
            agendamento -> {
              agendamento.setStatus(StatusAgendamento.CANCELADO);
              return agendamentoRepository.save(agendamento);
            });
  }

  public Mono<Agendamento> confirmarAgendamento(String id) {
    return agendamentoRepository
        .findById(id)
        .flatMap(
            agendamento -> {
              agendamento.setStatus(StatusAgendamento.CONFIRMADO);
              return agendamentoRepository.save(agendamento);
            });
  }

  public Mono<Agendamento> concluirAgendamento(String id) {
    return agendamentoRepository
        .findById(id)
        .flatMap(
            agendamento -> {
              agendamento.setStatus(StatusAgendamento.CONCLUIDO);
              return agendamentoRepository.save(agendamento);
            });
  }

  // Método para enriquecer um agendamento com dados relacionados
  public Mono<AgendamentoResponse> enriquecerAgendamento(Agendamento agendamento) {
    Mono<Usuario> clienteMono = usuarioRepository.findById(agendamento.getUsuarioId()).defaultIfEmpty(new Usuario());
    Mono<Usuario> profissionalMono = usuarioRepository
        .findById(agendamento.getProfissionalId())
        .defaultIfEmpty(new Usuario());
    Mono<Servico> servicoMono = servicoRepository.findById(agendamento.getServicoId()).defaultIfEmpty(new Servico());

    return Mono.zip(clienteMono, profissionalMono, servicoMono)
        .map(
            tuple -> {
              Usuario cliente = tuple.getT1();
              Usuario profissional = tuple.getT2();
              Servico servico = tuple.getT3();
              return AgendamentoResponse.fromAgendamentoCompleto(
                  agendamento, cliente, profissional, servico);
            });
  }

  // Método para enriquecer múltiplos agendamentos
  public Flux<AgendamentoResponse> enriquecerAgendamentos(Flux<Agendamento> agendamentos) {
    return agendamentos.flatMap(this::enriquecerAgendamento);
  }
}
