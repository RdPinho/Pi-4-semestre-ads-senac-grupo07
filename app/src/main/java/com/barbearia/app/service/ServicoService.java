package com.barbearia.app.service;

import com.barbearia.app.model.Servico;
import com.barbearia.app.repository.ServicoRepository;
import com.barbearia.app.repository.UsuarioRepository;
import com.barbearia.app.repository.dto.ServicoRequest;
import com.barbearia.app.controller.dto.ServicoResponse;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
public class ServicoService {
  private final ServicoRepository servicoRepository;
  private final UsuarioRepository usuarioRepository;

  public ServicoService(ServicoRepository servicoRepository, UsuarioRepository usuarioRepository) {
    this.servicoRepository = servicoRepository;
    this.usuarioRepository = usuarioRepository;
  }

  public Mono<Servico> cadastrarServico(ServicoRequest request) {
    return servicoRepository.save(request.toServico());
  }

  public Flux<Servico> listarServicos() {
    return servicoRepository.findAll();
  }

  public Flux<ServicoResponse> listarServicosComProfissional() {
    return servicoRepository.findAll()
        .flatMap(servico -> {
          if (servico.getProfissionalId() != null && !servico.getProfissionalId().isEmpty()) {
            return usuarioRepository.findById(servico.getProfissionalId())
                .map(usuario -> {
                  ServicoResponse response = ServicoResponse.fromServico(servico);
                  response.setProfissionalNome(usuario.getNome());
                  return response;
                })
                .defaultIfEmpty(ServicoResponse.fromServico(servico));
          } else {
            return Mono.just(ServicoResponse.fromServico(servico));
          }
        });
  }

  public Mono<Servico> buscarPorId(String id) {
    return servicoRepository.findById(id);
  }

  public Mono<Servico> atualizarServico(String id, ServicoRequest request) {
    return servicoRepository.findById(id)
        .flatMap(servico -> {
          servico.setNome(request.getNome());
          servico.setDescricao(request.getDescricao());
          servico.setPreco(request.getPreco());
          servico.setDuracaoMinutos(request.getDuracaoMinutos());
          return servicoRepository.save(servico);
        });
  }

  public Mono<Void> deletarServico(String id) {
    return servicoRepository.deleteById(id);
  }

  public Mono<Servico> alternarDisponibilidade(String id) {
    return servicoRepository.findById(id)
        .flatMap(servico -> {
          servico.setDisponivel(!servico.isDisponivel());
          return servicoRepository.save(servico);
        });
  }

  public Flux<ServicoResponse> listarServicosPorProfissional(String profissionalId) {
    return servicoRepository.findByProfissionalId(profissionalId)
        .flatMap(servico -> {
          return usuarioRepository.findById(profissionalId)
              .map(usuario -> {
                ServicoResponse response = ServicoResponse.fromServico(servico);
                response.setProfissionalNome(usuario.getNome());
                return response;
              })
              .defaultIfEmpty(ServicoResponse.fromServico(servico));
        });
  }
}
