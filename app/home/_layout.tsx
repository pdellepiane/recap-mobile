import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Tabs } from 'expo-router';
import { Image, type ImageSourcePropType } from 'react-native';

const TAB_ICON_SIZE = 24;

function TabBarIcon({ source }: { source: ImageSourcePropType }) {
  return (
    <Image
      source={source}
      style={{ width: TAB_ICON_SIZE, height: TAB_ICON_SIZE }}
      resizeMode="contain"
    />
  );
}

export default function HomeTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent[500],
        tabBarInactiveTintColor: colors.neutral.disabled,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.background.elevated,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          lineHeight: 16,
          fontFamily: fontFamilies.signikaRegular,
          fontWeight: '400',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Eventos',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={focused ? images.tabs.homeActive : images.tabs.homeInactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={focused ? images.tabs.notificationsActive : images.tabs.notificationsInactive}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Mi perfil',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={focused ? images.tabs.profileActive : images.tabs.profileInactive} />
          ),
        }}
      />
    </Tabs>
  );
}
