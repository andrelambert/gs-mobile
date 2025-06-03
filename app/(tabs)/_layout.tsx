import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { LayoutDashboard, MapPin, Clock, FileText, CircleHelp as HelpCircle } from 'lucide-react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: [
          styles.tabBar,
          { height: 70, paddingBottom: insets.bottom > 0 ? insets.bottom - 10 : 10 }
        ],
        tabBarLabelStyle: styles.tabLabel,
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
        headerTintColor: Colors.white,
        headerBackTitle: 'Voltar',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Panorama",
          tabBarLabel: "Panorama",
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} />
          ),
          headerTitle: "Panorama Geral",
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: "Localização",
          tabBarLabel: "Localização",
          tabBarIcon: ({ color, size }) => (
            <MapPin size={size} color={color} />
          ),
          headerTitle: "Localizações Atingidas",
        }}
      />
      <Tabs.Screen
        name="duration"
        options={{
          title: "Duração",
          tabBarLabel: "Duração",
          tabBarIcon: ({ color, size }) => (
            <Clock size={size} color={color} />
          ),
          headerTitle: "Tempo de Interrupção",
        }}
      />
      <Tabs.Screen
        name="damages"
        options={{
          title: "Prejuízos",
          tabBarLabel: "Prejuízos",
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} />
          ),
          headerTitle: "Prejuízos Causados",
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          title: "Dicas",
          tabBarLabel: "Dicas",
          tabBarIcon: ({ color, size }) => (
            <HelpCircle size={size} color={color} />
          ),
          headerTitle: "Recomendações",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
    paddingTop: 5,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
  },
  header: {
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 18,
  }
});