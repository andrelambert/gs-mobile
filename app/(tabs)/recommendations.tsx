import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import RecommendationCard from '@/components/RecommendationCard';
import { TriangleAlert as AlertTriangle, Lightbulb, BatteryFull, Umbrella, Phone } from 'lucide-react-native';

export default function RecommendationsScreen() {
  const handleCall = (phoneNumber: string) => {
    let number = phoneNumber.replace(/\D/g, '');
    let url = Platform.OS === 'ios' ? `telprompt:${number}` : `tel:${number}`;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.error('Error opening phone app:', err));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Recomendações de Segurança</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.introText}>
          Durante eventos de falta de energia causados por desastres naturais, 
          é importante seguir algumas recomendações para garantir sua segurança 
          e minimizar os impactos.
        </Text>
        
        <RecommendationCard 
          title="Antes da Tempestade"
          icon={<Umbrella size={24} color={Colors.primary} />}
          items={[
            "Mantenha um kit de emergência com lanternas, pilhas, rádio, água e alimentos não perecíveis",
            "Carregue dispositivos eletrônicos antecipadamente",
            "Baixe mapas offline e informações importantes no celular",
            "Identifique o disjuntor principal da sua residência",
            "Guarde documentos importantes em local seguro e impermeável"
          ]}
        />
        
        <RecommendationCard 
          title="Durante a Falta de Energia"
          icon={<AlertTriangle size={24} color={Colors.warning} />}
          items={[
            "Desligue e desconecte aparelhos eletrônicos para evitar danos por oscilações",
            "Mantenha refrigeradores e freezers fechados para preservar os alimentos",
            "Use lanternas em vez de velas para evitar riscos de incêndio",
            "Evite abrir a porta de casa desnecessariamente para manter a temperatura",
            "Não toque em cabos caídos ou postes danificados"
          ]}
        />
        
        <RecommendationCard 
          title="Uso de Geradores"
          icon={<BatteryFull size={24} color={Colors.danger} />}
          items={[
            "Nunca use geradores dentro de casa ou garagem fechada",
            "Mantenha o gerador a pelo menos 6 metros de distância de janelas e portas",
            "Siga as instruções do fabricante para operação e manutenção",
            "Não conecte o gerador diretamente à fiação da casa sem um interruptor de transferência",
            "Desligue o gerador e deixe-o esfriar antes de reabastecer"
          ]}
        />
        
        <RecommendationCard 
          title="Após o Restabelecimento"
          icon={<Lightbulb size={24} color={Colors.success} />}
          items={[
            "Verifique se há vazamentos de gás antes de ligar interruptores",
            "Ligue os aparelhos gradualmente para evitar sobrecarga",
            "Descarte alimentos refrigerados expostos a temperaturas acima de 4°C por mais de 2 horas",
            "Reponha os itens utilizados do kit de emergência",
            "Registre os danos ocorridos para possíveis reclamações ou seguros"
          ]}
        />
        
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            Estas recomendações são apenas orientativas. Sempre siga as instruções 
            das autoridades locais durante situações de emergência.
          </Text>
        </View>

        <View style={styles.emergencyButtons}>
          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: Colors.danger }]}
            onPress={() => handleCall('193')}
          >
            <Phone size={24} color={Colors.white} />
            <Text style={styles.emergencyButtonText}>Bombeiros</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: Colors.warning }]}
            onPress={() => handleCall('199')}
          >
            <Phone size={24} color={Colors.white} />
            <Text style={styles.emergencyButtonText}>Defesa Civil</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.emergencyButton, { backgroundColor: Colors.primary }]}
            onPress={() => handleCall('08007272196')}
          >
            <Phone size={24} color={Colors.white} />
            <Text style={styles.emergencyButtonText}>Enel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkText,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.darkText,
    marginBottom: 16,
  },
  footerNote: {
    marginTop: 24,
    padding: 16,
    backgroundColor: Colors.lightGray,
    borderRadius: 8,
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.mediumText,
  },
  emergencyButtons: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  emergencyButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  emergencyButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});