import { images } from '@/src/assets/images';
import { useTranslation } from '@/src/i18n';
import { Button, colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { Image, StyleSheet, Text, View } from 'react-native';

const CARD_H = 511;
const CARD_TOP = 118;
const ICON_TOP_W = 170;
const ICON_TOP_H = 120;

type Props = {
  kicker: string;
  instructionParagraphs: string[];
  onOpenCamera: () => void;
};

export function EventChallengePhotoBody({ kicker, instructionParagraphs, onOpenCamera }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.cardSection}>
      <View style={styles.card}>
        <Image
          source={images.eventDetail.challenges.challengePhotoCardBg}
          style={styles.cardBgImage}
          resizeMode="cover"
          accessibilityElementsHidden
        />

        <View style={styles.cardInner}>
          <Text style={styles.kicker}>{kicker}</Text>
          {instructionParagraphs.map((line, i) => (
            <Text
              key={`${String(i)}-${line}`}
              style={[
                styles.challengeTitle,
                i < instructionParagraphs.length - 1
                  ? styles.instructionParaSpacing
                  : styles.instructionParaLast,
              ]}
            >
              {line}
            </Text>
          ))}
          <Button
            title={t('common.takePhoto')}
            onPress={onOpenCamera}
            accessibilityLabel={t('common.takePhoto')}
            style={styles.cta}
            variant="secondary"
            rightIconSource={images.common.camera.icon}
            rightIconStyle={styles.ctaCameraIcon}
          />
        </View>
      </View>
      <Image
        source={images.eventDetail.challenges.photoCameraHero}
        style={styles.takePhotoIcon}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  cardSection: {
    marginTop: CARD_TOP,
    alignSelf: 'center',
    width: '80%',
  },
  card: {
    width: '100%',
    height: CARD_H,
    borderRadius: 16,
    backgroundColor: colors.background.elevated,
    paddingTop: 80,
    overflow: 'hidden',
  },
  cardBgImage: {
    position: 'absolute',
    width: '80%',
    height: '90%',
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 24,
  },
  kicker: {
    color: colors.accent[700],
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    fontFamily: fontFamilies.signikaRegular,
    textAlign: 'center',
    marginBottom: 14,
  },
  challengeTitle: {
    color: colors.neutral.primary,
    fontSize: 28,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 36,
    fontFamily: fontFamilies.signikaRegular,
    paddingHorizontal: 4,
    marginBottom: 10,
  },
  instructionParaSpacing: {
    marginBottom: 10,
  },
  instructionParaLast: {
    marginBottom: 16,
  },
  cta: {
    alignSelf: 'center',
    marginTop: 150,
    minWidth: 200,
  },
  ctaCameraIcon: {
    width: 20,
    height: 20,
    tintColor: colors.background.primary,
  },
  takePhotoIcon: {
    position: 'absolute',
    width: ICON_TOP_W,
    height: ICON_TOP_H,
    top: -80,
    paddingLeft: 25,
    alignSelf: 'center',
    zIndex: 2,
  },
});
