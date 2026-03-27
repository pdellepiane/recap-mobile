import { colors } from '@/src/ui';
import { type ImageSourcePropType, type ImageStyle } from 'react-native';

export type OverlayImage = {
  source: ImageSourcePropType;
  position: 'topLeft' | 'left' | 'custom';
  style?: ImageStyle;
};

export type OnboardingSlide = {
  id: string;
  backgroundColor: string;
  title: string;
  image: ImageSourcePropType;
  decorativeImages?: ImageSourcePropType[];
  overlayImages?: OverlayImage[];
  titlePosition: 'above' | 'below';
};

export const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    backgroundColor: colors.neutral.primary,
    title: 'Tu evento desde todos los puntos de vista.',
    image: require('@/assets/images/onboarding/onboarding1-image1.png'),
    overlayImages: [
      {
        source: require('@/assets/images/onboarding/onboarding1-image2.png'),
        position: 'topLeft',
        style: { width: 166, height: 166 },
      },
      {
        source: require('@/assets/images/onboarding/onboarding1-image3.png'),
        position: 'left',
        style: { width: 170, height: 128 },
      },
    ],
    titlePosition: 'below',
  },
  {
    id: '2',
    backgroundColor: colors.brand[400],
    title: 'Crea los mejores retos para tus invitados',
    image: require('@/assets/images/onboarding/onboarding2-image1.png'),
    overlayImages: [
      {
        source: require('@/assets/images/onboarding/onboarding2-image2.png'),
        position: 'custom',
        style: {
          width: 100,
          height: 100,
          left: 24,
          top: 40,
        },
      },
      {
        source: require('@/assets/images/onboarding/onboarding2-image3.png'),
        position: 'custom',
        style: {
          width: 200,
          height: 180,
          left: 0,
          bottom: 60,
          transform: [{ rotate: '-8deg' }],
        },
      },
      {
        source: require('@/assets/images/onboarding/onboarding2-image4.png'),
        position: 'custom',
        style: {
          width: 80,
          height: 80,
          right: 32,
          bottom: 80,
        },
      },
    ],
    titlePosition: 'above',
  },
  {
    id: '3',
    backgroundColor: colors.accent[400],
    title: 'Guarda tus recuerdos como interacciones',
    image: require('@/assets/images/onboarding/onboarding3-image1.png'),
    overlayImages: [
      {
        source: require('@/assets/images/onboarding/onboarding3-image2.png'),
        position: 'custom',
        style: {
          width: 78,
          height: 86,
          top: 54,
          left: 116,
        },
      },
      {
        source: require('@/assets/images/onboarding/onboarding3-image3.png'),
        position: 'custom',
        style: {
          width: 96,
          height: 102,
          left: -6,
          top: 186,
        },
      },
      {
        source: require('@/assets/images/onboarding/onboarding3-image4.png'),
        position: 'custom',
        style: {
          width: 132,
          height: 130,
          left: -12,
          bottom: 6,
        },
      },
    ],
    titlePosition: 'above',
  },
];
