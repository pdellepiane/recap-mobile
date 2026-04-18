import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Tabs } from 'expo-router';
import { Image, type ImageSourcePropType } from 'react-native';

const TAB_ICON_SIZE = 24;

const TAB_HOME = {
  active: require('@/assets/images/tabs/home-icon-active.png') as ImageSourcePropType,
  inactive: require('@/assets/images/tabs/home-inactive-icon.png') as ImageSourcePropType,
};

const TAB_NOTIFICATIONS = {
  active: require('@/assets/images/tabs/not-active-icon.png') as ImageSourcePropType,
  inactive: require('@/assets/images/tabs/noti-inactive-icon.png') as ImageSourcePropType,
};

const TAB_PROFILE = {
  active: require('@/assets/images/tabs/profile-active-icon.png') as ImageSourcePropType,
  inactive: require('@/assets/images/tabs/profile-inactive-icon.png') as ImageSourcePropType,
};

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
            <TabBarIcon source={focused ? TAB_HOME.active : TAB_HOME.inactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notificaciones',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={focused ? TAB_NOTIFICATIONS.active : TAB_NOTIFICATIONS.inactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Mi perfil',
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={focused ? TAB_PROFILE.active : TAB_PROFILE.inactive} />
          ),
        }}
      />
    </Tabs>
  );
}
