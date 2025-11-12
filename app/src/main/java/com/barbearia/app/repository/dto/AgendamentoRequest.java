package com.barbearia.app.repository.dto;

import com.barbearia.app.model.Agendamento;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AgendamentoRequest {
  // Campos do backend (português)
  private String usuarioId;
  private String profissionalId;
  private String servicoId;
  private LocalDateTime dataHora;

  // Campos do frontend (inglês) - mapeamento via Jackson
  @JsonProperty("clientId")
  private String clientId;

  @JsonProperty("professionalId")
  private String professionalId;

  @JsonProperty("serviceIds")
  private List<String> serviceIds;

  @JsonProperty("scheduledDate")
  private String scheduledDate; // formato: YYYY-MM-DD

  @JsonProperty("startTime")
  private String startTime; // formato: HH:mm

  @JsonProperty("notes")
  private String notes;

  public Agendamento toAgendamento() {
    Agendamento agendamento = new Agendamento();

    // Priorizar campos do backend, senão usar do frontend
    String userId = this.usuarioId != null ? this.usuarioId : this.clientId;
    String profId = this.profissionalId != null ? this.profissionalId : this.professionalId;
    String servId = this.servicoId != null ? this.servicoId
        : (this.serviceIds != null && !this.serviceIds.isEmpty() ? this.serviceIds.get(0) : null);

    // Converter scheduledDate + startTime para LocalDateTime se necessário
    LocalDateTime dateTime = this.dataHora;
    if (dateTime == null && this.scheduledDate != null && this.startTime != null) {
      LocalDate date = LocalDate.parse(this.scheduledDate);
      LocalTime time = LocalTime.parse(this.startTime, DateTimeFormatter.ofPattern("HH:mm"));
      dateTime = LocalDateTime.of(date, time);
    }

    agendamento.setUsuarioId(userId);
    agendamento.setProfissionalId(profId);
    agendamento.setServicoId(servId);
    agendamento.setDataHora(dateTime);

    return agendamento;
  }

  @Override
  public String toString() {
    return "AgendamentoRequest{" +
        "usuarioId='" + usuarioId + '\'' +
        ", profissionalId='" + profissionalId + '\'' +
        ", servicoId='" + servicoId + '\'' +
        ", dataHora=" + dataHora +
        ", clientId='" + clientId + '\'' +
        ", professionalId='" + professionalId + '\'' +
        ", serviceIds=" + serviceIds +
        ", scheduledDate='" + scheduledDate + '\'' +
        ", startTime='" + startTime + '\'' +
        ", notes='" + notes + '\'' +
        '}';
  }
}
