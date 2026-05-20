import { type FlashMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { type RefObject } from 'react';
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export type CapturedPhotoAsset = {
  uri: string;
  width?: number;
  height?: number;
};

type Params = {
  galleryPermissionTitle: string;
  galleryPermissionMessage: string;
};

/**
 * Shared photo capture state for custom camera screens.
 */
export function usePhotoCaptureFlow({ galleryPermissionTitle, galleryPermissionMessage }: Params) {
  const [cameraReady, setCameraReady] = useState(false);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [capturing, setCapturing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhotoAsset | null>(null);

  const flashForCamera: FlashMode = flash === 'on' ? 'on' : 'off';

  const beginCapture = useCallback(() => {
    if (!cameraReady || capturing || selectedPhoto) {
      return false;
    }
    setCapturing(true);
    return true;
  }, [cameraReady, capturing, selectedPhoto]);

  const endCapture = useCallback(() => {
    setCapturing(false);
  }, []);

  const toggleFlash = useCallback(() => {
    setFlash((value) => (value === 'on' ? 'off' : 'on'));
  }, []);

  const toggleFacing = useCallback(() => {
    setFacing((value) => {
      const nextFacing = value === 'back' ? 'front' : 'back';
      if (nextFacing === 'front') {
        setFlash('off');
      }
      return nextFacing;
    });
  }, []);

  const handleCaptureResult = useCallback(
    (asset: CapturedPhotoAsset | string | null | undefined) => {
      if (typeof asset === 'string') {
        if (asset) {
          setSelectedPhoto({ uri: asset });
        }
        return;
      }
      if (asset?.uri) {
        setSelectedPhoto(asset);
      }
    },
    [],
  );

  const capturePhoto = useCallback(
    async (
      cameraRef: RefObject<{
        takePictureAsync: (options?: { quality?: number }) => Promise<CapturedPhotoAsset>;
      } | null>,
    ) => {
      if (!cameraRef.current || !beginCapture()) {
        return;
      }
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
        handleCaptureResult(photo);
      } catch {
        // no-op
      } finally {
        endCapture();
      }
    },
    [beginCapture, endCapture, handleCaptureResult],
  );

  const openGallery = useCallback(async () => {
    if (selectedPhoto) {
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(galleryPermissionTitle, galleryPermissionMessage);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (result.canceled || !result.assets?.length) {
      return;
    }
    const asset = result.assets[0];
    if (!asset?.uri) {
      return;
    }
    setSelectedPhoto({
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
    });
  }, [galleryPermissionMessage, galleryPermissionTitle, selectedPhoto]);

  const discardPreview = useCallback(() => {
    setSelectedPhoto(null);
    setCameraReady(false);
  }, []);

  const showCamera = !selectedPhoto;
  const showPreview = Boolean(selectedPhoto);

  return useMemo(
    () => ({
      cameraReady,
      onCameraReady: () => setCameraReady(true),
      facing,
      flash,
      flashForCamera,
      capturing,
      selectedPhoto,
      beginCapture,
      endCapture,
      toggleFlash,
      toggleFacing,
      handleCaptureResult,
      capturePhoto,
      openGallery,
      discardPreview,
      showCamera,
      showPreview,
    }),
    [
      beginCapture,
      cameraReady,
      capturing,
      discardPreview,
      endCapture,
      facing,
      flash,
      flashForCamera,
      handleCaptureResult,
      capturePhoto,
      openGallery,
      selectedPhoto,
      showCamera,
      showPreview,
      toggleFacing,
      toggleFlash,
    ],
  );
}
