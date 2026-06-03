import { images } from '@/src/assets/images';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type ProfileMenuRowProps = {
  label: string;
  iconSource: ImageSourcePropType;
  onPress: () => void;
};

export function ProfileMenuRow({ label, iconSource, onPress }: ProfileMenuRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.rowIconWrap}>
        <View style={styles.rowIcon}>
          <Image source={iconSource} style={styles.rowIconImage} resizeMode="contain" />
        </View>
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        <Image
          source={images.common.caretRight}
          style={styles.caretIcon}
          resizeMode="contain"
          accessibilityElementsHidden
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  rowPressed: {
    backgroundColor: colors.background.primaryOpacity5 ?? 'rgba(34,34,34,0.5)',
  },
  rowIconWrap: {
    width: 40,
    alignItems: 'center',
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconImage: {
    width: 21,
    height: 21,
    tintColor: colors.neutral.secondary,
  },
  rowLabel: {
    flex: 1,
    fontFamily: fontFamilies.signikaRegular,
    fontSize: 18,
    color: colors.neutral.primary,
    marginLeft: 15,
  },
  rowRight: {
    width: 26,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  caretIcon: {
    width: 14,
    height: 24,
    tintColor: colors.neutral.primary,
  },
});
