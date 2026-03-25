import { Button, Spinner } from "@/src/ui";
import { StyleSheet, Text, View } from "react-native";

import { useCoordinator } from "@/src/navigation/useCoordinator";

import { useEventDetail } from "../hooks/useEventDetail";

type EventDetailScreenPageProps = {
  eventId: string;
};

export const EventDetailScreenPage = ({
  eventId,
}: EventDetailScreenPageProps) => {
  const { goBack } = useCoordinator();
  const { event, isLoading } = useEventDetail(eventId);

  if (isLoading) {
    return <Spinner style={styles.loader} />;
  }

  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Event not found</Text>
        <Button title="Back" onPress={goBack} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.meta}>Date: {event.date}</Text>
      <Text style={styles.meta}>Location: {event.location}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <Button title="Back" onPress={goBack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  meta: {
    fontSize: 16,
    color: "#4b5563",
  },
  description: {
    marginVertical: 12,
    fontSize: 16,
    lineHeight: 24,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
