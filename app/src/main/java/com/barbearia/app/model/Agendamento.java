package com.barbearia.app.model;

import com.barbearia.app.model.enums.StatusAgendamento;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Document(collection = "agendamentos")
public class Agendamento {
  @Id private String id;
  private String usuarioId;
  private String profissionalId;
  private String servicoId;
  private LocalDateTime dataHora;
  private StatusAgendamento status;
}
