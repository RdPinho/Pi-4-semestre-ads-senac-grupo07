package com.barbearia.app.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TipoUsuario {
  CLIENTE("Cliente"),
  PROFISSIONAL("Profissional");

  private final String descricao;

  TipoUsuario(String descricao) {
    this.descricao = descricao;
  }

  @JsonCreator
  public static TipoUsuario fromDescricao(String value) {
    for (TipoUsuario tipo : TipoUsuario.values()) {
      if (tipo.name().equalsIgnoreCase(value)) {
        return tipo;
      }
    }
    throw new IllegalArgumentException("Tipo de usuário inválido: " + value);
  }

  @JsonValue
  public String getDescricao() {
    return descricao;
  }
}
