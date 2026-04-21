import { images } from '@/src/assets/images';
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
    image: images.onboarding.step1.hero,
    overlayImages: [
      {
        source: images.onboarding.step1.overlay2,
        position: 'topLeft',
        style: { width: 166, height: 166 },
      },
      {
        source: images.onboarding.step1.overlay3,
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
    image: images.onboarding.step2.hero,
    overlayImages: [
      {
        source: images.onboarding.step2.overlay2,
        position: 'custom',
        style: {
          width: 100,
          height: 100,
          left: 24,
          top: 40,
        },
      },
      {
        source: images.onboarding.step2.overlay3,
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
        source: images.onboarding.step2.overlay4,
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
    image: images.onboarding.step3.hero,
    overlayImages: [
      {
        source: images.onboarding.step3.overlay2,
        position: 'custom',
        style: {
          width: 78,
          height: 86,
          top: 54,
          left: 116,
        },
      },
      {
        source: images.onboarding.step3.overlay3,
        position: 'custom',
        style: {
          width: 96,
          height: 102,
          left: -6,
          top: 186,
        },
      },
      {
        source: images.onboarding.step3.overlay4,
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
