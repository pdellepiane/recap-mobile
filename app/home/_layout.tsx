import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { PlatformPressable } from '@react-navigation/elements';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { useMemo } from 'react';
import { Image, type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_ICON_SIZE = 24;
const TAB_BAR_ITEM_HEIGHT = 49;
/** Home-button devices (e.g. iPhone SE) report `insets.bottom === 0`; keep labels off the screen edge. */
const TAB_BAR_MIN_BOTTOM_INSET = 10;

function TabBarIcon({ source }: { source: ImageSourcePropType }) {
  return (
    <Image
      source={source}
      style={{ width: TAB_ICON_SIZE, height: TAB_ICON_SIZE }}
      resizeMode="contain"
    />
  );
}

function HomeButtonTabBarButton(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      style={[
        props.style,
        {
          flex: 1,
          justifyContent: 'center',
          paddingVertical: 0,
        },
      ]}
    />
  );
}

export default function HomeTabsLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const isHomeButtonDevice = insets.bottom === 0;

  const homeButtonSafeAreaInsets = useMemo(
    () => ({
      top: 0,
      left: 0,
      right: 0,
      bottom: TAB_BAR_MIN_BOTTOM_INSET,
    }),
    [],
  );

  const screenOptions = useMemo(() => {
    const base = {
      headerShown: false,
      tabBarActiveTintColor: colors.accent[500],
      tabBarInactiveTintColor: colors.neutral.disabled,
      tabBarLabelStyle: {
        fontSize: 12,
        lineHeight: 16,
        fontFamily: fontFamilies.signikaRegular,
        fontWeight: '400' as const,
      },
    };

    if (!isHomeButtonDevice) {
      return {
        ...base,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.background.elevated,
          borderTopWidth: 1,
        },
      };
    }

    return {
      ...base,
      tabBarButton: HomeButtonTabBarButton,
      tabBarStyle: {
        backgroundColor: colors.background.secondary,
        borderTopColor: colors.background.elevated,
        borderTopWidth: 1,
        paddingTop: TAB_BAR_MIN_BOTTOM_INSET / 2,
        height: TAB_BAR_ITEM_HEIGHT + TAB_BAR_MIN_BOTTOM_INSET + TAB_BAR_MIN_BOTTOM_INSET / 2,
      },
      tabBarItemStyle: {
        height: TAB_BAR_ITEM_HEIGHT,
        justifyContent: 'center' as const,
      },
    };
  }, [isHomeButtonDevice]);

  return (
    <Tabs
      {...(isHomeButtonDevice ? { safeAreaInsets: homeButtonSafeAreaInsets } : {})}
      screenOptions={screenOptions}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.events'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon source={focused ? images.tabs.homeActive : images.tabs.homeInactive} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: t('tabs.notifications'),
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
          title: t('tabs.profile'),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              source={focused ? images.tabs.profileActive : images.tabs.profileInactive}
            />
          ),
        }}
      />
    </Tabs>
  );
}
