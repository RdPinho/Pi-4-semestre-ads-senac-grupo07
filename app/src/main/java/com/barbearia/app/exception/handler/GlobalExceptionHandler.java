package com.barbearia.app.exception.handler;

import com.barbearia.app.controller.dto.response.ApiResponse;
import com.barbearia.app.exception.CredenciaisInvalidasException;
import com.barbearia.app.exception.EmailJaCadastradoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import reactor.core.publisher.Mono;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(EmailJaCadastradoException.class)
  public Mono<ResponseEntity<ApiResponse<Void>>> handleEmailJaCadastradoException(EmailJaCadastradoException ex) {
    ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
    return Mono.just(ResponseEntity.status(HttpStatus.CONFLICT).body(response));
  }

  @ExceptionHandler(CredenciaisInvalidasException.class)
  public Mono<ResponseEntity<ApiResponse<Void>>> handleCredenciaisInvalidasException(CredenciaisInvalidasException ex) {
    ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
    return Mono.just(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public Mono<ResponseEntity<ApiResponse<Void>>> handleValidationException(MethodArgumentNotValidException ex) {
    String errors = ex.getBindingResult().getFieldErrors().stream()
        .map(error -> error.getField() + ": " + error.getDefaultMessage())
        .collect(Collectors.joining("; "));
    ApiResponse<Void> response = ApiResponse.error(errors);
    return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response));
  }

  @ExceptionHandler(IllegalArgumentException.class)
  public Mono<ResponseEntity<ApiResponse<Void>>> handleIllegalArgumentException(IllegalArgumentException ex) {
    ApiResponse<Void> response = ApiResponse.error(ex.getMessage());
    return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response));
  }

  @ExceptionHandler(Exception.class)
  public Mono<ResponseEntity<ApiResponse<Void>>> handleGenericException(Exception ex) {
    ApiResponse<Void> response = ApiResponse.error("Erro interno do servidor: " + ex.getMessage());
    return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response));
  }
}
