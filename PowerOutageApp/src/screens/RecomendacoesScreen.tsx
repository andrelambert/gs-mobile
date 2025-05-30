import React from 'react';
import { Text, StyleSheet, ScrollView, View, TouchableOpacity } from 'react-native';
// Importe os ícones que vamos usar. Escolha o pacote que preferir (MaterialCommunityIcons é bem completo)
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface RecommendationItemProps {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  title: string;
  description: string;
  iconColor?: string;
}

const RecommendationItem: React.FC<RecommendationItemProps> = ({ iconName, title, description, iconColor = '#2980b9' }) => {
  return (
    <View style={styles.itemCard}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={iconName} size={28} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
    </View>
  );
};

interface EmergencyContactProps {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  serviceName: string;
  number?: string; // Número é opcional aqui, pois "Serviços de Emergência" agrupa vários
  iconColor?: string;
}

const EmergencyContact: React.FC<EmergencyContactProps> = ({ iconName, serviceName, number, iconColor = '#c0392b' }) => {
  return (
    <View style={styles.itemCard}>
       <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={iconName} size={28} color={iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.itemTitle}>{serviceName} {number && <Text style={styles.emergencyNumberText}>{number}</Text>}</Text>
      </View>
      {/* A seta (chevron) é mais para itens clicáveis. Como é informativo, podemos omitir ou adicionar se quiser. */}
      {/* <MaterialCommunityIcons name="chevron-right" size={24} color="#7f8c8d" style={styles.chevron}/> */}
    </View>
  );
};


const RecomendacoesScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.mainTitle}>Segurança em Falta de Energia</Text>

      <Text style={styles.sectionTitle}>Antes da Emergência</Text>
      <RecommendationItem
        iconName="briefcase-plus-outline"
        title="Prepare um Kit de Emergência"
        description="Tenha lanternas, pilhas, rádio, carregador portátil, água, alimentos não perecíveis e primeiros socorros."
      />
      <RecommendationItem
        iconName="cellphone-cog" // Ícone para operações manuais ou configurações
        title="Conheça Operações Manuais"
        description="Saiba como abrir portões de garagem elétricos ou outras travas manuais, se necessário."
      />
      <RecommendationItem
        iconName="battery-charging-high"
        title="Carregue Dispositivos"
        description="Mantenha celulares e carregadores portáteis (power banks) com carga total."
      />

      <Text style={styles.sectionTitle}>Durante a Falta de Energia</Text>
      <RecommendationItem
        iconName="power-plug-off-outline"
        title="Desconecte Aparelhos"
        description="Retire da tomada para evitar danos por picos de tensão quando a energia voltar."
      />
      <RecommendationItem
        iconName="flashlight"
        title="Use Lanternas, Não Velas"
        description="Lanternas são seguras. Velas apresentam alto risco de incêndio."
        iconColor="#f39c12" // Laranja para destaque
      />
      <RecommendationItem
        iconName="door-closed-lock"
        title="Mantenha Portas Fechadas"
        description="Conserve a temperatura de geladeiras e freezers, abrindo-os o mínimo possível."
      />
      <RecommendationItem
        iconName="engine-off-outline" // Ícone para gerador com alerta
        title="Cuidado Extremo com Geradores"
        description="NUNCA use em locais fechados (risco fatal por intoxicação). Somente ao ar livre e bem ventilado."
        iconColor="#e74c3c" // Vermelho para alerta crítico
      />
       <RecommendationItem
        iconName="information-outline"
        title="Mantenha-se Informado"
        description="Use rádio a pilha ou celular (com moderação) para notícias e alertas oficiais."
      />
      <RecommendationItem
        iconName="phone-hangup-outline" // Para fios caídos/perigo
        title="Fios Partidos? Alerte e Afaste-se!"
        description="Mantenha distância segura de fios caídos. Avise Bombeiros (193) ou Defesa Civil (199)."
        iconColor="#e74c3c"
      />


      <Text style={styles.sectionTitle}>Após o Retorno da Energia</Text>
      <RecommendationItem
        iconName="magnify-scan" // Ícone para verificar
        title="Verifique Danos e Religue com Cuidado"
        description="Inspecione aparelhos antes de religar. Aguarde alguns minutos e religue-os gradualmente."
      />
      <RecommendationItem
        iconName="food-drumstick-off-outline" // Ícone para comida estragada
        title="Inspecione Alimentos"
        description="Descarte qualquer alimento que ficou em temperatura ambiente inadequada. Na dúvida, não consuma."
      />
      <RecommendationItem
        iconName="archive-refresh-outline"
        title="Reabasteça o Kit"
        description="Reponha pilhas, água, alimentos e outros itens utilizados do seu kit de emergência."
      />

      <Text style={styles.sectionTitle}>Números de Emergência</Text>
      <EmergencyContact
        iconName="hospital-box-outline"
        serviceName="Serviços de Emergência"
        number="(190, 192, 193)"
      />
      <EmergencyContact
        iconName="shield-account-variant-outline" // Ícone para Defesa Civil
        serviceName="Defesa Civil"
        number="199"
      />
      <EmergencyContact
        iconName="transmission-tower" // Ícone para companhia elétrica
        serviceName="Sua Companhia de Energia"
        number="(Tenha o número local)"
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Um cinza bem claro de fundo, mais suave
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1e21', // Preto suave
    textAlign: 'left', // Alinhado à esquerda como na imagem
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600', // Semibold
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 20,
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2, // Sombra para Android
    shadowColor: '#000000', // Sombra para iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    marginRight: 16,
    padding: 8, // Um pequeno padding em volta do ícone se quiser destacar
    // backgroundColor: '#e7f3ff', // Opcional: um fundo leve para o ícone
    // borderRadius: 20, // Opcional: para fazer o fundo do ícone redondo
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d2129',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#606770',
    lineHeight: 20,
  },
  emergencyNumberText: {
    fontWeight: 'bold',
    color: '#c0392b', // Cor do número de emergência
  },
  // chevron: { // Estilo para a seta, se decidir usá-la
  //   marginLeft: 'auto', // Empurra para a direita
  // }
});

export default RecomendacoesScreen;