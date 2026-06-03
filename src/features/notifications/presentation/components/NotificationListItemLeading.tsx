import type { NotificationLeading } from '../../data/notificationItem';
import { images } from '@/src/assets/images';
import { colors, HostInitialsAvatar } from '@/src/ui';
import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { Image, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';

const LEADING_SIZE = 48;
const THUMB_RADIUS = 10;
const STACKED_SIZE = 36;
const STACKED_OVERLAP = 14;
const OVERLAY_SIZE = 22;

type Props = {
  initialsName: string;
  leading: NotificationLeading;
  isUnread: boolean;
};

function shouldShowUnreadDot(leading: NotificationLeading, isUnread: boolean): boolean {
  if (!isUnread) {
    return false;
  }
  // Live badge already occupies the top-right corner on this leading type.
  return leading.kind !== 'thumbnailWithLive';
}

function LeadingShell({
  children,
  isUnread,
  leading,
}: {
  children: ReactNode;
  isUnread: boolean;
  leading: NotificationLeading;
}) {
  return (
    <View style={styles.leadingShell}>
      {children}
      {shouldShowUnreadDot(leading, isUnread) ? <View style={styles.unreadDot} /> : null}
    </View>
  );
}

export function NotificationListItemLeading({ initialsName, leading, isUnread }: Props) {
  if (leading.kind === 'initials') {
    return (
      <LeadingShell isUnread={isUnread} leading={leading}>
        <HostInitialsAvatar
          fullName={initialsName}
          colorIndex={leading.colorIndex}
          size={LEADING_SIZE}
          appearance="pastel"
        />
      </LeadingShell>
    );
  }

  if (leading.kind === 'avatar') {
    return (
      <LeadingShell isUnread={isUnread} leading={leading}>
        <ExpoImage
          source={{ uri: leading.imageUrl }}
          style={styles.avatar}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </LeadingShell>
    );
  }

  if (leading.kind === 'profileThumbnail') {
    return (
      <LeadingShell isUnread={isUnread} leading={leading}>
        <ExpoImage
          source={{ uri: leading.imageUrl }}
          style={styles.profileThumbnail}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      </LeadingShell>
    );
  }

  if (leading.kind === 'stackedAvatars') {
    const [first, second] = leading.imageUrls;
    return (
      <LeadingShell isUnread={isUnread} leading={leading}>
        <View style={styles.stackedWrap}>
          <ExpoImage source={{ uri: first }} style={styles.stackedAvatarBack} contentFit="cover" />
          <ExpoImage
            source={{ uri: second }}
            style={styles.stackedAvatarFront}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        </View>
      </LeadingShell>
    );
  }

  if (leading.kind === 'initialsWithAvatar') {
    return (
      <LeadingShell isUnread={isUnread} leading={leading}>
        <View style={styles.initialsWithAvatarWrap}>
          <HostInitialsAvatar
            fullName={initialsName}
            colorIndex={leading.colorIndex}
            size={LEADING_SIZE}
            appearance="pastel"
          />
          <ExpoImage
            source={{ uri: leading.overlayImageUrl }}
            style={styles.initialsOverlayAvatar}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        </View>
      </LeadingShell>
    );
  }

  return (
    <LeadingShell isUnread={isUnread} leading={leading}>
      <View style={styles.thumbnailWrap}>
        <ExpoImage
          source={{ uri: leading.imageUrl }}
          style={styles.thumbnail}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        {leading.kind === 'thumbnailWithMessage' ? (
          <View style={styles.messageBadge}>
            <Ionicons name="chatbubble-ellipses" size={11} color={colors.background.primary} />
          </View>
        ) : null}
        {leading.kind === 'thumbnailWithChallenges' ? (
          <View style={styles.challengesBadge}>
            <Image source={images.common.questionIcon} style={styles.challengesBadgeIcon} />
          </View>
        ) : null}
        {leading.kind === 'thumbnailWithLive' ? (
          <View style={styles.liveDot} />
        ) : null}
      </View>
    </LeadingShell>
  );
}

const styles = StyleSheet.create({
  leadingShell: {
    width: LEADING_SIZE,
    height: LEADING_SIZE,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accent[500],
    borderWidth: 2,
    borderColor: colors.background.primary,
    zIndex: 10,
  },
  avatar: {
    width: LEADING_SIZE,
    height: LEADING_SIZE,
    borderRadius: LEADING_SIZE / 2,
    backgroundColor: colors.background.elevated,
  },
  profileThumbnail: {
    width: LEADING_SIZE,
    height: LEADING_SIZE,
    borderRadius: THUMB_RADIUS,
    backgroundColor: colors.background.elevated,
  },
  stackedWrap: {
    width: LEADING_SIZE,
    height: LEADING_SIZE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackedAvatarBack: {
    width: STACKED_SIZE,
    height: STACKED_SIZE,
    borderRadius: STACKED_SIZE / 2,
    backgroundColor: colors.background.elevated,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  stackedAvatarFront: {
    width: STACKED_SIZE,
    height: STACKED_SIZE,
    borderRadius: STACKED_SIZE / 2,
    backgroundColor: colors.background.elevated,
    borderWidth: 2,
    borderColor: colors.background.primary,
    marginLeft: -STACKED_OVERLAP,
  },
  initialsWithAvatarWrap: {
    width: LEADING_SIZE,
    height: LEADING_SIZE,
    position: 'relative',
  },
  initialsOverlayAvatar: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: OVERLAY_SIZE,
    height: OVERLAY_SIZE,
    borderRadius: OVERLAY_SIZE / 2,
    borderWidth: 2,
    borderColor: colors.background.primary,
    backgroundColor: colors.brand[500],
  },
  thumbnailWrap: {
    width: LEADING_SIZE,
    height: LEADING_SIZE,
    position: 'relative',
  },
  thumbnail: {
    width: LEADING_SIZE,
    height: LEADING_SIZE,
    borderRadius: THUMB_RADIUS,
    backgroundColor: colors.background.elevated,
  },
  messageBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.states.warning,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  challengesBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: colors.accent[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  challengesBadgeIcon: {
    width: 12,
    height: 12,
    tintColor: colors.neutral.onLime,
  },
  liveDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.states.active,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
});
