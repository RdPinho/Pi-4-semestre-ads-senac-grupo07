package com.barbearia.app.repository;

import com.barbearia.app.model.Agendamento;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface AgendamentoRepository extends ReactiveMongoRepository<Agendamento, String> {
  Mono<Agendamento> save(Agendamento agendamento);

  Flux<Agendamento> findByProfissionalId(String profissionalId);

  Flux<Agendamento> findByUsuarioId(String usuarioId);
}
