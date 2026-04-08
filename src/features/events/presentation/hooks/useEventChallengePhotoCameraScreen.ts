import { setChallengePhotoCompletionPreview } from '../data/challengePhotoCompletionPreview';
import { getEventChallenges } from '../data/eventChallenges';
import { useCoordinator } from '@/src/navigation/useCoordinator';
import { type FlashMode } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';

const UPLOAD_SIMULATION_MS = 2000;

type Params = {
  eventId: string;
  challengeId: string;
  challengeNumber?: number;
};

/**
 * Encapsulates challenge-photo camera flow: labels, capture/gallery handlers and upload simulation.
 */
export function useEventChallengePhotoCameraScreen({
  eventId,
  challengeId,
  challengeNumber,
}: Params) {
  const { goBack, goToEventChallengePhotoCompleted } = useCoordinator();
  const [cameraReady, setCameraReady] = useState(false);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const [capturing, setCapturing] = useState(false);
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const flashForCamera: FlashMode = flash === 'on' ? 'on' : 'off';

  const { challengeTitle, numberLabel, resolvedNumber, photoPoints } = useMemo(() => {
    const challenges = getEventChallenges(eventId);
    const challenge = challenges.find((r) => r.id === challengeId);
    const n = challenge?.number ?? challengeNumber ?? 2;
    return {
      challengeTitle: challenge?.title ?? 'Tómate una foto\npara el\nevento.',
      numberLabel: `Challenge ${String(n)}`,
      resolvedNumber: n,
      photoPoints: challenge?.points ?? 10,
    };
  }, [eventId, challengeId, challengeNumber]);

  const instructionParagraphs = useMemo(
    () =>
      challengeTitle
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [challengeTitle],
  );

  const runUploadSimulation = useCallback(async () => {
    if (!selectedPhotoUri) {
      return;
    }
    const uri = selectedPhotoUri;
    setIsUploading(true);
    await new Promise<void>((resolve) => {
      setTimeout(resolve, UPLOAD_SIMULATION_MS);
    });
    setIsUploading(false);
    setSelectedPhotoUri(null);
    setChallengePhotoCompletionPreview(uri);
    goToEventChallengePhotoCompleted(eventId, challengeId, resolvedNumber, photoPoints);
  }, [
    selectedPhotoUri,
    goToEventChallengePhotoCompleted,
    eventId,
    challengeId,
    resolvedNumber,
    photoPoints,
  ]);

  const handleCaptureResult = useCallback((uri: string | null | undefined) => {
    if (uri) {
      setSelectedPhotoUri(uri);
    }
  }, []);

  const beginCapture = useCallback(() => {
    if (!cameraReady || capturing || selectedPhotoUri) {
      return false;
    }
    setCapturing(true);
    return true;
  }, [cameraReady, capturing, selectedPhotoUri]);

  const endCapture = useCallback(() => {
    setCapturing(false);
  }, []);

  const toggleFlash = useCallback(() => {
    setFlash((f) => (f === 'on' ? 'off' : 'on'));
  }, []);

  const openGallery = useCallback(async () => {
    if (selectedPhotoUri || isUploading) {
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso', 'Para elegir una foto de la galería necesitamos acceso a tus fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (result.canceled || !result.assets?.length) {
      return;
    }
    const uri = result.assets[0]?.uri;
    if (uri) {
      setSelectedPhotoUri(uri);
    }
  }, [selectedPhotoUri, isUploading]);

  const discardPreview = useCallback(() => {
    setSelectedPhotoUri(null);
    setCameraReady(false);
  }, []);

  const showCamera = !selectedPhotoUri && !isUploading;
  const showPreviewSharp = Boolean(selectedPhotoUri) && !isUploading;
  const showUploadingOverlay = Boolean(selectedPhotoUri) && isUploading;

  const showInfoAlert = useCallback(() => {
    Alert.alert(
      'Challenge foto',
      'Toma una foto que cumpla la consigna. Puedes usar el flash, cambiar de cámara o elegir una imagen de la galería.',
    );
  }, []);

  const showPreviewInfoAlert = useCallback(() => {
    Alert.alert(
      'Challenge foto',
      'Revisa la foto y toca «Agregar foto» para publicarla en el evento.',
    );
  }, []);

  const toggleFacing = useCallback(() => {
    setFacing((f) => (f === 'back' ? 'front' : 'back'));
  }, []);

  return {
    goBack,
    cameraReady,
    onCameraReady: () => setCameraReady(true),
    facing,
    flash,
    flashForCamera,
    capturing,
    selectedPhotoUri,
    isUploading,
    numberLabel,
    instructionParagraphs,
    beginCapture,
    endCapture,
    handleCaptureResult,
    toggleFlash,
    openGallery,
    discardPreview,
    runUploadSimulation,
    showCamera,
    showPreviewSharp,
    showUploadingOverlay,
    showInfoAlert,
    showPreviewInfoAlert,
    toggleFacing,
  };
}
