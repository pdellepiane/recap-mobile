import { Image } from 'react-native';

export function measureSlideHeightFromUri(uri: string, cardWidth: number): Promise<number> {
  return new Promise((resolve) => {
    if (!uri?.trim()) {
      resolve(0);
      return;
    }
    Image.getSize(
      uri,
      (imgW, imgH) => {
        if (imgW > 0 && imgH > 0) {
          resolve(Math.round((cardWidth * imgH) / imgW));
        } else {
          resolve(0);
        }
      },
      () => resolve(0),
    );
  });
}
