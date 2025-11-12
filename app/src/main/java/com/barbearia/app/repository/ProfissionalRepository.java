package com.barbearia.app.repository;

import com.barbearia.app.model.Profissional;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface ProfissionalRepository extends ReactiveMongoRepository<Profissional, String> {
  Flux<Profissional> findAll();
  Mono<Profissional> findByEmail(String email);
}
