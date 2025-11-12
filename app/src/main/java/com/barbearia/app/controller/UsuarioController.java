package com.barbearia.app.controller;

import com.barbearia.app.controller.dto.response.ApiResponse;
import com.barbearia.app.model.Usuario;
import com.barbearia.app.service.UsuarioService;
import com.barbearia.app.service.ProfissionalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@Tag(name = "Usuários", description = "Endpoints para gerenciamento de usuários")
public class UsuarioController {

  private final UsuarioService usuarioService;
  private final ProfissionalService profissionalService;

  public UsuarioController(UsuarioService usuarioService, ProfissionalService profissionalService) {
    this.usuarioService = usuarioService;
    this.profissionalService = profissionalService;
  }

  @GetMapping
  @Operation(summary = "Listar usuários", description = "Endpoint para listar todos os usuários ou filtrar por tipo")
  public Mono<ApiResponse<List<Usuario>>> listarUsuarios(@RequestParam(required = false) String tipo) {
    return usuarioService.buscarUsuariosPorTipo(tipo)
        .collectList()
        .map(usuarios -> ApiResponse.success(usuarios, "Usuários listados com sucesso"))
        .onErrorResume(e -> Mono.just(
            ApiResponse.error("Erro ao listar usuários: " + e.getMessage())));
  }

  @GetMapping("/profissionais/por-servicos")
  @Operation(summary = "Listar profissionais por serviços", description = "Retorna profissionais que oferecem todos os serviços especificados")
  public Mono<ApiResponse<List<Usuario>>> listarProfissionaisPorServicos(
      @RequestParam List<String> serviceIds) {
    return profissionalService.listarProfissionaisPorServicos(serviceIds)
        .collectList()
        .map(profissionais -> ApiResponse.success(
            profissionais,
            "Profissionais encontrados com sucesso"))
        .onErrorResume(e -> Mono.just(
            ApiResponse.error("Erro ao buscar profissionais: " + e.getMessage())));
  }
}
