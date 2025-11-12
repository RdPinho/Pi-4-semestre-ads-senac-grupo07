package com.barbearia.app.repository;

import com.barbearia.app.model.Cliente;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
public interface ClienteRepository extends ReactiveMongoRepository<Cliente, String> {
  Mono<Cliente> findByEmail(String email);
}
