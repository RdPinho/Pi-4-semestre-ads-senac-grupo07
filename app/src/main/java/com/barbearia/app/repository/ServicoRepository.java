package com.barbearia.app.repository;

import com.barbearia.app.model.Servico;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface ServicoRepository extends ReactiveMongoRepository<Servico, String> {
  Mono<Servico> save(Servico servico);

  Flux<Servico> findByProfissionalId(String profissionalId);
}
