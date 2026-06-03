import { EventChallengeHeaderView } from '../shared/EventChallengeHeaderView';
import { useTranslation } from '@/src/i18n';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  contentTopInset: number;
};

/** Shown when the quiz challenge cannot be loaded for this event. */
export function EventChallengeQuizUnavailableView({ contentTopInset }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.root}>
      <EventChallengeHeaderView />
      <View style={[styles.body, { paddingTop: contentTopInset }]}>
        <Text style={styles.message}>{t('quiz.unavailable')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.neutral.secondary,
    textAlign: 'center',
    fontFamily: fontFamilies.regular,
  },
});
