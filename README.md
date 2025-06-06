# Global Solution - Mobile Development

Repositório para a entrega da disciplina Mobile Development para a Global Solution do primeiro semestre da 3ESPW (Engenharia de Software)

## Grupo

- André Lambert - RM 99148
- Felipe Cortez - RM 99750
- Lorenzo Ferreira - RM 97318

## Resumo do Projeto

O projeto é um aplicativo chamado "Power Outage Tracker", desenvolvido para rastrear e gerenciar quedas de energia. Ele utiliza o Expo para facilitar o desenvolvimento e a execução em múltiplas plataformas.

## Walkthrough

O aplicativo "Power Outage Tracker" possui as seguintes páginas principais:

### 1. Panorama (Home)
- Exibe uma visão geral dos eventos de falta de energia registrados
- Apresenta estatísticas como número total de eventos, eventos ativos e resolvidos
- Permite filtrar eventos por localização
- Possibilita acessar detalhes de eventos específicos

### 2. Localização
- Oferece duas visualizações: lista e mapa
- Na visualização em lista, exibe todas as localizações afetadas com contagem de eventos
- Na visualização em mapa, mostra pins nos locais onde foram registradas ocorrências
- Utiliza as coordenadas geográficas obtidas pelo CEP via API ViaCEP
- Permite navegar para a lista de eventos ao clicar em uma localização

### 3. Duração
- Apresenta análises sobre o tempo médio de duração das quedas de energia
- Categoriza os eventos por duração (curta, média, longa)
- Exibe dados sobre impacto da duração dos eventos

### 4. Prejuízos
- Lista os prejuízos causados pelas faltas de energia
- Mostra dados consolidados sobre tipos de prejuízos mais comuns
- Permite registrar novos prejuízos relacionados a eventos

### 5. Recomendações
- Oferece dicas e recomendações para lidar com situações de falta de energia
- Apresenta medidas preventivas para minimizar prejuízos
- Inclui guias sobre o que fazer durante e após quedas de energia

### Funcionalidades adicionais:
- Tela de cadastro de novos eventos com busca automática de endereço por CEP
- Armazenamento local dos dados utilizando AsyncStorage
- Integração com APIs externas para obtenção de dados geográficos

## Dependências

- **@expo/vector-icons**: Ícones para a interface do usuário.
- **@react-native-async-storage/async-storage**: Armazenamento assíncrono para persistência de dados.
- **@react-navigation/native** e **@react-navigation/bottom-tabs**: Navegação entre telas.
- **expo-camera**: Acesso à câmera do dispositivo.
- **expo-constants**: Acesso a constantes do sistema.
- **expo-font**: Gerenciamento de fontes personalizadas.
- **expo-linear-gradient**: Criação de gradientes lineares.
- **expo-location**: Acesso e gerenciamento da localização do usuário.
- **react-native-gesture-handler**: Manipulação de gestos.
- **react-native-maps**: Implementação de mapas interativos.
- **react-native-reanimated**: Animações fluidas.
- **react-native-safe-area-context**: Gerenciamento de áreas seguras em dispositivos.
- **react-native-screens**: Otimização de transições de tela.
- **react-native-webview**: Exibição de conteúdo web dentro do aplicativo.

## Pré-requisitos

- Node.js
- npm
- Expo CLI

## Instalação

1. Clone o repositório:
   ```bash
   git clone <URL-do-repositorio>
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd gs-mobile
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```

## Uso

Para iniciar o projeto, execute o seguinte comando:
```bash
npx expo start
```

O aplicativo pode ser executado em:
- Dispositivo físico através do aplicativo Expo Go (escaneando o QR code)
- Emulador iOS ou Android
- Navegador web (com funcionalidades limitadas)

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.