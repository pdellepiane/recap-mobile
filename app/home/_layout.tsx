import { colors } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function HomeTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.states.active,
        tabBarInactiveTintColor: colors.neutral.disabled,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.background.elevated,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size ?? 26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size ?? 26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Mi perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size ?? 26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
