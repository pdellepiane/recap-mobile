import { useCoordinator } from "@/src/navigation/useCoordinator";
import { Button, Spinner } from "@/src/ui";
import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEvents } from "../hooks/useEvents";

export const HomeScreenPage = () => {
  const { goToEventDetail, goToProfile } = useCoordinator();
  const { events, isLoading } = useEvents();

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Ir a perfil"
        onPress={goToProfile}
        style={{ marginBottom: 16 }}
      />
      <Button
        title="Cerrar sesion"
        onPress={goToProfile}
        style={{ marginBottom: 16 }}
      />
      <Text style={styles.title}>Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => goToEventDetail(item.id)}
            style={styles.card}
          >
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.meta}>{item.date}</Text>
            <Text style={styles.meta}>{item.location}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  meta: {
    color: "#6b7280",
    marginTop: 4,
  },
});
