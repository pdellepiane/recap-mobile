import { BackButton, Spinner } from "@/src/ui";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "../hooks/useProfile";

export const ProfileScreenPage = () => {
  const { profile, isLoading } = useProfile();

  if (isLoading) {
    return <Spinner style={styles.loader} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>My Profile</Text>
      <Text style={styles.field}>Name: {profile?.name ?? "-"}</Text>
      <Text style={styles.field}>Email: {profile?.email ?? "-"}</Text>
    </SafeAreaView>
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
    marginBottom: 8,
  },
  field: {
    fontSize: 16,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
