package com.barbearia.app.controller;

import com.barbearia.app.controller.dto.AgendamentoResponse;
import com.barbearia.app.controller.dto.response.ApiResponse;
import com.barbearia.app.repository.dto.AgendamentoRequest;
import com.barbearia.app.service.AgendamentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/agendamentos")
@Tag(name = "Agendamentos", description = "Operações relacionadas a agendamentos de serviços na barbearia")
public class AgendamentoController {

  private final AgendamentoService agendamentoService;

  public AgendamentoController(AgendamentoService agendamentoService) {
    this.agendamentoService = agendamentoService;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  @Operation(summary = "Criar um novo agendamento", description = "Cria um novo agendamento de um serviço na barbearia.")
  public Mono<ApiResponse<AgendamentoResponse>> criarAgendamento(
      @RequestBody AgendamentoRequest agendamentoRequest) {
    return agendamentoService
        .criarAgendamento(agendamentoRequest)
        .map(AgendamentoResponse::fromAgendamento)
        .map(response -> ApiResponse.success(response, "Agendamento criado com sucesso"));
  }

  @GetMapping
  @Operation(summary = "Listar agendamentos", description = "Lista todos os agendamentos ou filtra por parâmetros.")
  public Mono<ApiResponse<java.util.List<AgendamentoResponse>>> listarAgendamentos(
      @RequestParam(required = false) String profissionalId,
      @RequestParam(required = false) String professionalId,
      @RequestParam(required = false) String usuarioId,
      @RequestParam(required = false) String clientId,
      @RequestParam(required = false) String status,
      @RequestParam(required = false, defaultValue = "true") Boolean expandir) {

    // Aceita tanto usuarioId quanto clientId (mesmo campo)
    String userId = usuarioId != null ? usuarioId : clientId;

    // Aceita tanto profissionalId quanto professionalId
    String profId = profissionalId != null ? profissionalId : professionalId;

    Flux<AgendamentoResponse> agendamentos;

    if (profId != null) {
      Flux<com.barbearia.app.model.Agendamento> agendamentosFlux;
      if (status != null) {
        agendamentosFlux = agendamentoService.listarAgendamentosPorProfissionalComStatus(profId, status);
      } else {
        agendamentosFlux = agendamentoService.listarAgendamentosPorProfissional(profId);
      }

      // Se expandir=true, enriquecer com dados relacionados
      agendamentos = expandir
          ? agendamentoService.enriquecerAgendamentos(agendamentosFlux)
          : agendamentosFlux.map(AgendamentoResponse::fromAgendamento);

    } else if (userId != null) {
      Flux<com.barbearia.app.model.Agendamento> agendamentosFlux;
      if (status != null) {
        agendamentosFlux = agendamentoService.listarAgendamentosPorUsuarioComStatus(userId, status);
      } else {
        agendamentosFlux = agendamentoService.listarAgendamentosPorUsuario(userId);
      }

      // Se expandir=true, enriquecer com dados relacionados
      agendamentos = expandir
          ? agendamentoService.enriquecerAgendamentos(agendamentosFlux)
          : agendamentosFlux.map(AgendamentoResponse::fromAgendamento);

    } else {
      Flux<com.barbearia.app.model.Agendamento> agendamentosFlux = agendamentoService.listarTodosAgendamentos();

      agendamentos = expandir
          ? agendamentoService.enriquecerAgendamentos(agendamentosFlux)
          : agendamentosFlux.map(AgendamentoResponse::fromAgendamento);
    }

    return agendamentos
        .collectList()
        .map(list -> ApiResponse.success(list, "Agendamentos encontrados com sucesso"));
  }

  @GetMapping("/{id}")
  @Operation(summary = "Buscar agendamento por ID", description = "Retorna um agendamento específico pelo ID.")
  public Mono<ApiResponse<AgendamentoResponse>> buscarAgendamentoPorId(@PathVariable String id) {
    return agendamentoService
        .buscarAgendamentoPorId(id)
        .map(AgendamentoResponse::fromAgendamento)
        .map(response -> ApiResponse.success(response, "Agendamento encontrado"));
  }

  @PatchMapping("/{id}/cancelar")
  @Operation(summary = "Cancelar agendamento", description = "Cancela um agendamento existente.")
  public Mono<ApiResponse<AgendamentoResponse>> cancelarAgendamento(@PathVariable String id) {
    return agendamentoService
        .cancelarAgendamento(id)
        .map(AgendamentoResponse::fromAgendamento)
        .map(response -> ApiResponse.success(response, "Agendamento cancelado com sucesso"));
  }

  @PatchMapping("/{id}/confirmar")
  @Operation(summary = "Confirmar agendamento", description = "Confirma um agendamento existente.")
  public Mono<ApiResponse<AgendamentoResponse>> confirmarAgendamento(@PathVariable String id) {
    return agendamentoService
        .confirmarAgendamento(id)
        .map(AgendamentoResponse::fromAgendamento)
        .map(response -> ApiResponse.success(response, "Agendamento confirmado com sucesso"));
  }

  @PatchMapping("/{id}/concluir")
  @Operation(summary = "Concluir agendamento", description = "Marca um agendamento como concluído.")
  public Mono<ApiResponse<AgendamentoResponse>> concluirAgendamento(@PathVariable String id) {
    return agendamentoService
        .concluirAgendamento(id)
        .map(AgendamentoResponse::fromAgendamento)
        .map(response -> ApiResponse.success(response, "Agendamento concluído com sucesso"));
  }
}
