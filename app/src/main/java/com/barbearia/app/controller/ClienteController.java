package com.barbearia.app.controller;

import com.barbearia.app.model.Cliente;
import com.barbearia.app.model.Usuario;
import com.barbearia.app.service.ClienteService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/clientes")
@Tag(name = "Clientes", description = "Operações relacionadas aos clientes da barbearia")
public class ClienteController {
  private final ClienteService clienteService;

  public ClienteController(ClienteService clienteService) {
    this.clienteService = clienteService;
  }

  @GetMapping
  public Flux<Usuario> listarClientes() {
    return clienteService.listarClientes();
  }
}
