import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter_600SemiBold',
          fontSize: 12,
          fontWeight: 'bold',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.eat', 'Comer'),
          tabBarIcon: ({ color }) => <Ionicons name="restaurant" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reviews"
        options={{
          title: t('tabs.reviews', 'Avaliações'),
          tabBarIcon: ({ color }) => <Ionicons name="star" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="achievements"
        options={{
          title: t('tabs.achievements', 'Conquistas'),
          tabBarIcon: ({ color }) => <Ionicons name="trophy" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings', 'Configurações'),
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
