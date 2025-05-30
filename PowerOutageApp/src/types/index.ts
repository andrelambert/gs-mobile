export interface PowerOutageEvent {
    id: string; // Gerado automaticamente (ex: UUID)
    timestampRegistro: string; // Data e hora do registro (ISO string)
    localizacao: {
      descricao: string; // Bairro, cidade ou CEP
    };
    interrupcao: {
      inicio: string; // Data e hora de início (ISO string)
      fim?: string; // Opcional, se a energia já voltou (ISO string)
      duracaoEstimada?: string; // Ex: "2 horas", "Indeterminado"
      // duracaoReal será calculada dinamicamente se 'fim' existir
    };
    prejuizos?: string; // Descrição textual dos prejuízos
    causa?: string; // Opcional: Chuva intensa, Vento forte, Deslizamento, Outro
  }