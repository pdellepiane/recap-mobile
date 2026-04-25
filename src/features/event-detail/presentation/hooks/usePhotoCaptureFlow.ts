import { type FlashMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
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
export function usePhotoCaptureFlow({
  galleryPermissionTitle,
  galleryPermissionMessage,
}: Params) {
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
    setFacing((value) => (value === 'back' ? 'front' : 'back'));
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
      openGallery,
      selectedPhoto,
      showCamera,
      showPreview,
      toggleFacing,
      toggleFlash,
    ],
  );
}
