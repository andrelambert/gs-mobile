import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const RecomendacoesScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recomendações Importantes</Text>
      <Text style={styles.paragraph}>
        Em caso de falta de energia causada por eventos naturais:
      </Text>
      <Text style={styles.listItem}>- Mantenha a calma.</Text>
      <Text style={styles.listItem}>- Desconecte aparelhos eletrônicos da tomada para evitar danos quando a energia retornar.</Text>
      <Text style={styles.listItem}>- Tenha lanternas e pilhas carregadas.</Text>
      <Text style={styles.listItem}>- Evite usar velas devido ao risco de incêndio.</Text>
      <Text style={styles.listItem}>- Mantenha geladeiras e freezers fechados para conservar os alimentos.</Text>
      <Text style={styles.listItem}>- Acompanhe notícias e comunicados oficiais.</Text>
      <Text style={styles.listItem}>- Se houver cabos elétricos caídos, mantenha distância e avise a companhia elétrica e os bombeiros.</Text>
      {/* Adicione mais recomendações conforme necessário */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  paragraph: { fontSize: 16, marginBottom: 8 },
  listItem: { fontSize: 16, marginBottom: 4, marginLeft: 8 },
});

export default RecomendacoesScreen;