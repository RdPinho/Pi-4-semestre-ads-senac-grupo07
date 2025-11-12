package com.barbearia.app.model;

import java.math.BigDecimal;
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
@Document(collection = "servicos")
public class Servico {
  @Id
  private String id;
  private String nome;
  private String descricao;
  private BigDecimal preco;
  private int duracaoMinutos;
  private String[] horariosDisponiveis;
  private String profissionalId; // ID do profissional que oferece este serviço
  private boolean disponivel = true; // Status de disponibilidade para agendamento
}
