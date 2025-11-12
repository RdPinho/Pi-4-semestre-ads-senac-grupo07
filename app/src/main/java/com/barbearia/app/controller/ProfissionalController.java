package com.barbearia.app.controller;

import com.barbearia.app.model.Agendamento;
import com.barbearia.app.model.Usuario;
import com.barbearia.app.service.AgendamentoService;
import com.barbearia.app.service.ProfissionalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/profissionais")
@Tag(name = "Profissionais", description = "Operações relacionadas aos profissionais da barbearia")
public class ProfissionalController {

  private final ProfissionalService profissionalService;

  private final AgendamentoService agendamentoService;

  public ProfissionalController(ProfissionalService profissionalService,AgendamentoService agendamentoService) {
    this.profissionalService = profissionalService;
    this.agendamentoService = agendamentoService;
  }

  @PostMapping
  @Operation(
      summary = "Listar todos os profissionais",
      description = "Retorna uma lista de todos os profissionais cadastrados na barbearia.")
  public Flux<Usuario> listarProfissionais() {
    return profissionalService.listarProfissionais();
  }

  @GetMapping
  @Operation(
      summary = "Listar agendamentos por profissional",
      description = "Retorna uma lista de agendamentos associados a cada profissional.")
  public Flux<Agendamento> listarAgendamentosPorProfissional(@RequestParam(required = false) String id) {
    return agendamentoService.listarAgendamentosPorProfissional(id);
  }
}
