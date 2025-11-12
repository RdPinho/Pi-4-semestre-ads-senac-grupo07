package com.barbearia.app.model.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum StatusAgendamento {
  PENDENTE("Pendente"),
  AGENDADO("Agendado"), // Alias para PENDENTE (usado como SCHEDULED no frontend)
  CONFIRMADO("Confirmado"),
  EM_ANDAMENTO("Em Andamento"),
  CANCELADO("Cancelado"),
  CONCLUIDO("Concluído"),
  NAO_COMPARECEU("Não Compareceu"),
  // Aliases em inglês para compatibilidade com frontend
  SCHEDULED("Agendado"),
  CONFIRMED("Confirmado"),
  IN_PROGRESS("Em Andamento"),
  CANCELED("Cancelado"),
  COMPLETED("Concluído"),
  NO_SHOW("Não Compareceu");

  private final String descricao;

  StatusAgendamento(String descricao) {
    this.descricao = descricao;
  }

  @JsonCreator
  public static StatusAgendamento fromDescricao(String value) {
    for (StatusAgendamento status : StatusAgendamento.values()) {
      if (status.name().equalsIgnoreCase(value)) {
        return status;
      }
    }
    throw new IllegalArgumentException("Status de agendamento inválido: " + value);
  }

  public String getDescricao() {
    return descricao;
  }

  /**
   * Verifica se dois status são equivalentes (considerando aliases)
   */
  public static boolean areEquivalent(StatusAgendamento status1, StatusAgendamento status2) {
    return getNormalizedStatus(status1) == getNormalizedStatus(status2);
  }

  /**
   * Normaliza o status para sua versão principal (português)
   */
  public static StatusAgendamento getNormalizedStatus(StatusAgendamento status) {
    switch (status) {
      case SCHEDULED:
      case AGENDADO:
      case PENDENTE:
        return PENDENTE;
      case CONFIRMED:
      case CONFIRMADO:
        return CONFIRMADO;
      case IN_PROGRESS:
      case EM_ANDAMENTO:
        return EM_ANDAMENTO;
      case CANCELED:
      case CANCELADO:
        return CANCELADO;
      case COMPLETED:
      case CONCLUIDO:
        return CONCLUIDO;
      case NO_SHOW:
      case NAO_COMPARECEU:
        return NAO_COMPARECEU;
      default:
        return status;
    }
  }
}
