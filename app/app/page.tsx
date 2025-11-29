import { OverviewLayout } from "./overview-layout";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function AppPage() {
  return (
    <AuthGuard>
      <OverviewLayout />
    </AuthGuard>
  );
}
