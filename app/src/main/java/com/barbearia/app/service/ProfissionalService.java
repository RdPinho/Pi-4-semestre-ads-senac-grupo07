package com.barbearia.app.service;

import com.barbearia.app.model.Usuario;
import com.barbearia.app.repository.UsuarioRepository;
import com.barbearia.app.repository.ServicoRepository;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

import java.util.List;

@Service
public class ProfissionalService {

  private final UsuarioRepository usuarioRepository;
  private final ServicoRepository servicoRepository;

  public ProfissionalService(UsuarioRepository usuarioRepository, ServicoRepository servicoRepository) {
    this.usuarioRepository = usuarioRepository;
    this.servicoRepository = servicoRepository;
  }

  public Flux<Usuario> listarProfissionais() {
    return usuarioRepository.findByTipo("PROFISSIONAL");
  }

  public Flux<Usuario> listarProfissionaisPorServicos(List<String> serviceIds) {
    // Buscar profissionais que oferecem TODOS os serviços selecionados
    return Flux.fromIterable(serviceIds)
        .flatMap(servicoRepository::findById)
        .map(servico -> servico.getProfissionalId())
        .distinct()
        .collectList()
        .flatMapMany(profissionalIds -> {
          // Contar quantos serviços cada profissional oferece
          return Flux.fromIterable(profissionalIds)
              .flatMap(profId -> servicoRepository.findByProfissionalId(profId)
                  .filter(servico -> serviceIds.contains(servico.getId()))
                  .count()
                  .filter(count -> count == serviceIds.size()) // Apenas profissionais que oferecem TODOS os serviços
                  .map(count -> profId))
              .flatMap(usuarioRepository::findById);
        });
  }
}
