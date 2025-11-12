package com.barbearia.app.repository;

import com.barbearia.app.model.Usuario;

import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface UsuarioRepository extends ReactiveMongoRepository<Usuario, String> {
  Mono<Usuario> findByEmail(String email);
  Flux<Usuario> findByTipo(String tipo);
  Flux<Usuario> findAll();

}
