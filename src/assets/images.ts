/**
 * Single registry for local image modules (`require`). Add new assets here instead of scattered paths.
 */
export const images = {
  common: {
    back: require('@/assets/images/common/back-icon.png'),
    start: require('@/assets/images/common/start-icon.png'),
    scheduled: require('@/assets/images/common/scheduled-icon.png'),
    copy: require('@/assets/images/common/copy-icon.png'),
    edit: require('@/assets/images/common/edit-icon.png'),
    share: require('@/assets/images/common/share-icon.png'),
    checkGrey: require('@/assets/images/common/check-grey-icon.png'),
    checkGreen: require('@/assets/images/common/check-green-icon.png'),
    check: require('@/assets/images/common/check-icon.png'),
    goToRight: require('@/assets/images/common/go-to-right-icon.png'),
    heart: require('@/assets/images/common/heart-icon.png'),
    live: require('@/assets/images/common/live-icon.png'),
    remove: require('@/assets/images/common/remove-icon.png'),
    info: require('@/assets/images/common/info-icon.png'),
    questionIcon: require('@/assets/images/common/question-icon.png'),
    caretRight: require('@/assets/images/common/caret-right-icon.png'),
    camera: {
      icon: require('@/assets/images/common/camera/camera-icon.png'),
      close: require('@/assets/images/common/camera/close-icon.png'),
      flash: require('@/assets/images/common/camera/flash-icon.png'),
      gallery: require('@/assets/images/common/camera/gallery-icon.png'),
      switch: require('@/assets/images/common/camera/switch-icon.png'),
    },
  },
  tabs: {
    homeActive: require('@/assets/images/tabs/home-icon-active.png'),
    homeInactive: require('@/assets/images/tabs/home-inactive-icon.png'),
    notificationsActive: require('@/assets/images/tabs/not-active-icon.png'),
    notificationsInactive: require('@/assets/images/tabs/noti-inactive-icon.png'),
    profileActive: require('@/assets/images/tabs/profile-active-icon.png'),
    profileInactive: require('@/assets/images/tabs/profile-inactive-icon.png'),
  },
  homeBanner: {
    state1: {
      left: require('@/assets/images/home/banner-state-1/item-1.png'),
      logo: require('@/assets/images/home/banner-state-1/item-2.png'),
    },
    state2: {
      decor: require('@/assets/images/home/banner-state-2/item-1.png'),
    },
    state3: {
      decor: require('@/assets/images/home/banner-state-3/item-1.png'),
      emojiParty: require('@/assets/images/home/banner-state-3/item-2.png'),
      emojiHearts: require('@/assets/images/home/banner-state-3/item-3.png'),
    },
  },
  home: {
    background: require('@/assets/images/home/background.png'),
    noEvents: require('@/assets/images/home/no-events-icon.png'),
  },
  notifications: {
    empty: require('@/assets/images/notifications/empty-notifications-icon.png'),
  },
  profile: {
    username: require('@/assets/images/profile/username-icon.png'),
    rateApp: require('@/assets/images/profile/rate-app-icon.png'),
    termsConditions: require('@/assets/images/profile/term-conditions-icon.png'),
  },
  eventDetail: {
    icons: {
      createChallenge: require('@/assets/images/event-detail/create-challenge-icon.png'),
      date: require('@/assets/images/event-detail/date-icon.png'),
      locationLime: require('@/assets/images/event-detail/icon-location-lime.png'),
      guestsLime: require('@/assets/images/event-detail/icon-guests-lime.png'),
    },
    reactions: {
      party: require('@/assets/images/event-detail/reactions/1-party.png'),
      sad: require('@/assets/images/event-detail/reactions/2-sad.png'),
      fun: require('@/assets/images/event-detail/reactions/3-fun.png'),
      hearts: require('@/assets/images/event-detail/reactions/4-hearts.png'),
    },
    challenges: {
      createPhotoChallengeIcon: require('@/assets/images/event-detail/challenges/create-photo-challenge-icon.png'),
      createQuizChallengeIcon: require('@/assets/images/event-detail/challenges/create-quiz-challenge-icon.png'),
      challengePhotoCardBg: require('@/assets/images/event-detail/challenges/challenge-photo-card-bg.png'),
      photoCtaButton: require('@/assets/images/event-detail/challenges/reto-photo-tomar-foto-button.png'),
      photoCameraHero: require('@/assets/images/event-detail/challenges/reto-photo-camera-hero.png'),
      triviaBubbles: require('@/assets/images/event-detail/challenges/reto-trivia-bubbles.png'),
      cardDecorUnion: require('@/assets/images/event-detail/challenges/reto-card-decor-union.png'),
      quizCorner: require('@/assets/images/event-detail/challenges/reto-quiz-corner.png'),
      /** Challenge list row icon for quiz type (`question-icon.png`). */
      addIcon: require('@/assets/images/event-detail/challenges/add-icon.png'),
      createdQuestionIcon: require('@/assets/images/event-detail/challenges/created-question-icon.png'),

      photoCorner: require('@/assets/images/event-detail/challenges/reto-photo-corner.png'),
      photoLabelIcon: require('@/assets/images/event-detail/challenges/reto-photo-label-icon.png'),
      /** Host empty state (“0 retos”) in challenges tab. */
      sadFaceIcon: require('@/assets/images/event-detail/challenges/sad-face-icon.png'),
    },
    ranking: {
      badgeScallop: require('@/assets/images/event-detail/ranking/ranking-badge-scallop.png'),
    },
  },
  onboarding: {
    step1: {
      hero: require('@/assets/images/onboarding/onboarding1-image1.png'),
      overlay2: require('@/assets/images/onboarding/onboarding1-image2.png'),
      overlay3: require('@/assets/images/onboarding/onboarding1-image3.png'),
    },
    step2: {
      hero: require('@/assets/images/onboarding/onboarding2-image1.png'),
      overlay2: require('@/assets/images/onboarding/onboarding2-image2.png'),
      overlay3: require('@/assets/images/onboarding/onboarding2-image3.png'),
      overlay4: require('@/assets/images/onboarding/onboarding2-image4.png'),
    },
    step3: {
      hero: require('@/assets/images/onboarding/onboarding3-image1.png'),
      overlay2: require('@/assets/images/onboarding/onboarding3-image2.png'),
      overlay3: require('@/assets/images/onboarding/onboarding3-image3.png'),
      overlay4: require('@/assets/images/onboarding/onboarding3-image4.png'),
    },
  },
} as const;

export type AppImages = typeof images;
