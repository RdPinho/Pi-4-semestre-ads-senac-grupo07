package com.barbearia.app.controller;

import com.barbearia.app.controller.dto.ServicoResponse;
import com.barbearia.app.controller.dto.response.ApiResponse;
import com.barbearia.app.repository.dto.ServicoRequest;
import com.barbearia.app.service.ServicoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
@Tag(name = "Serviços", description = "Operações relacionadas aos serviços oferecidos pela barbearia")
public class ServicoController {

  private final ServicoService servicoService;

  public ServicoController(ServicoService servicoService) {
    this.servicoService = servicoService;
  }

  @PostMapping
  @Operation(summary = "Cadastrar um novo serviço", description = "Permite cadastrar um novo serviço oferecido pela barbearia")
  public Mono<ApiResponse<ServicoResponse>> cadastrarServico(@RequestBody ServicoRequest servicoRequest) {
    return servicoService.cadastrarServico(servicoRequest)
        .map(servico -> ApiResponse.success(
            ServicoResponse.fromServico(servico),
            "Serviço cadastrado com sucesso"))
        .onErrorResume(e -> Mono.just(
            ApiResponse.error("Erro ao cadastrar serviço: " + e.getMessage())));
  }

  @GetMapping
  @Operation(summary = "Listar todos os serviços", description = "Retorna uma lista com todos os serviços cadastrados")
  public Mono<ApiResponse<List<ServicoResponse>>> listarServicos() {
    return servicoService.listarServicosComProfissional()
        .collectList()
        .map(servicos -> ApiResponse.success(
            servicos,
            "Serviços listados com sucesso"))
        .onErrorResume(e -> Mono.just(
            ApiResponse.error("Erro ao listar serviços: " + e.getMessage())));
  }

  @GetMapping("/{id}")
  @Operation(summary = "Buscar serviço por ID", description = "Retorna os detalhes de um serviço específico")
  public Mono<ApiResponse<ServicoResponse>> buscarServicoPorId(@PathVariable String id) {
    return servicoService.buscarPorId(id)
        .map(servico -> ApiResponse.success(
            ServicoResponse.fromServico(servico),
            "Serviço encontrado"))
        .switchIfEmpty(Mono.just(
            ApiResponse.error("Serviço não encontrado")))
        .onErrorResume(e -> Mono.just(
            ApiResponse.error("Erro ao buscar serviço: " + e.getMessage())));
  }

  @PutMapping("/{id}")
  @Operation(summary = "Atualizar um serviço", description = "Atualiza as informações de um serviço existente")
  public Mono<ApiResponse<ServicoResponse>> atualizarServico(
      @PathVariable String id,
      @RequestBody ServicoRequest servicoRequest) {
    return servicoService.atualizarServico(id, servicoRequest)
        .map(servico -> ApiResponse.success(
            ServicoResponse.fromServico(servico),
            "Serviço atualizado com sucesso"))
        .switchIfEmpty(Mono.just(
            ApiResponse.error("Serviço não encontrado")))
        .onErrorResume(e -> Mono.just(
            ApiResponse.error("Erro ao atualizar serviço: " + e.getMessage())));
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Deletar um serviço", description = "Remove um serviço do sistema")
  public Mono<ApiResponse<ServicoResponse>> deletarServico(@PathVariable String id) {
    return servicoService.deletarServico(id)
        .then(Mono.just(ApiResponse.<ServicoResponse>success(null, "Serviço deletado com sucesso")))
        .onErrorResume(e -> Mono.just(
            ApiResponse.error("Erro ao deletar serviço: " + e.getMessage())));
  }

  @PatchMapping("/{id}/disponibilidade")
  @Operation(summary = "Alternar disponibilidade do serviço", description = "Alterna o status de disponibilidade de um serviço para agendamento")
  public Mono<ApiResponse<ServicoResponse>> alternarDisponibilidade(@PathVariable String id) {
    return servicoService.alternarDisponibilidade(id)
        .map(servico -> ApiResponse.success(
            ServicoResponse.fromServico(servico),
            "Disponibilidade alterada com sucesso"))
        .switchIfEmpty(Mono.just(
            ApiResponse.error("Serviço não encontrado")))
        .onErrorResume(e -> Mono.just(
            ApiResponse.error("Erro ao alterar disponibilidade: " + e.getMessage())));
  }

  @GetMapping("/profissional/{profissionalId}")
  @Operation(summary = "Listar serviços de um profissional", description = "Retorna todos os serviços oferecidos por um profissional específico")
  public Mono<ApiResponse<List<ServicoResponse>>> listarServicosPorProfissional(@PathVariable String profissionalId) {
    return servicoService.listarServicosPorProfissional(profissionalId)
        .collectList()
        .map(servicos -> ApiResponse.success(
            servicos,
            "Serviços do profissional listados com sucesso"))
        .onErrorResume(e -> Mono.just(
            ApiResponse.error("Erro ao listar serviços do profissional: " + e.getMessage())));
  }
}
