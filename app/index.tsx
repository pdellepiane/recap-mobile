import { Redirect, type Href } from "expo-router";

import { routePaths } from "@/src/navigation/routes";

export default function IndexRoute() {
  return <Redirect href={routePaths.onboarding as Href} />;
}
