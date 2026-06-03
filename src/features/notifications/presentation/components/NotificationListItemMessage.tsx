import type { NotificationMessage } from '../../data/notificationItem';
import { colors } from '@/src/ui';
import { fontFamilies } from '@/src/ui/typography';
import { StyleSheet, Text } from 'react-native';

type Props = {
  message: NotificationMessage;
};

export function NotificationListItemMessage({ message }: Props) {
  switch (message.kind) {
    case 'actorThenBody':
      return (
        <Text style={styles.message}>
          <Text style={styles.emphasis}>{message.actorName} </Text>
          <Text style={styles.regular}>{message.body}</Text>
        </Text>
      );
    case 'prefixThenActor':
      return (
        <Text style={styles.message}>
          <Text style={styles.regular}>{message.prefix}</Text>
          <Text style={styles.emphasis}>{message.actorName}</Text>
        </Text>
      );
    case 'prefixActorSuffix':
      return (
        <Text style={styles.message}>
          <Text style={styles.regular}>{message.prefix}</Text>
          <Text style={styles.emphasis}>{message.actorName}</Text>
          <Text style={styles.regular}>{message.suffix}</Text>
        </Text>
      );
    case 'prefixedActorThenBody':
      return (
        <Text style={styles.message}>
          <Text style={styles.regular}>{message.actorPrefix}</Text>
          <Text style={styles.emphasis}>{message.actorName}</Text>
          <Text style={styles.regular}> {message.body}</Text>
        </Text>
      );
    case 'plain':
      return <Text style={styles.messagePlain}>{message.text}</Text>;
  }
}

const styles = StyleSheet.create({
  message: {
    marginBottom: 6,
  },
  messagePlain: {
    color: colors.neutral.primary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.signikaRegular,
    fontWeight: '400',
    marginBottom: 6,
  },
  emphasis: {
    color: colors.neutral.primary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.signikaSemiBold,
    fontWeight: '600',
  },
  regular: {
    color: colors.neutral.primary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.signikaRegular,
    fontWeight: '400',
  },
});
