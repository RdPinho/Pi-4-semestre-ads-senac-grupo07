package com.barbearia.app.controller.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
  private boolean success;
  private T data;
  private String message;
  private LocalDateTime timestamp;

  public ApiResponse(boolean success, T data, String message) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.timestamp = LocalDateTime.now();
  }

  public static <T> ApiResponse<T> success(T data) {
    return new ApiResponse<>(true, data, null, LocalDateTime.now());
  }

  public static <T> ApiResponse<T> success(T data, String message) {
    return new ApiResponse<>(true, data, message, LocalDateTime.now());
  }

  public static <T> ApiResponse<T> error(String message) {
    return new ApiResponse<>(false, null, message, LocalDateTime.now());
  }
}
