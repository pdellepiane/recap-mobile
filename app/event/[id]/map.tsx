import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

function firstString(v: string | string[] | undefined): string | undefined {
  if (v === undefined) {
    return undefined;
  }
  return Array.isArray(v) ? v[0] : v;
}

export default function EventMapRoute() {
  const { id, q } = useLocalSearchParams<{ id: string; q?: string | string[] }>();

  return <Text>Hola</Text>;
}
