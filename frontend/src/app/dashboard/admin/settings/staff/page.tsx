import { StaffClient } from "./StaffClient";

export default function StaffSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff & Roles</h1>
        <p className="text-muted-foreground">
          Manage your team, assign administrative roles, and control access permissions.
        </p>
      </div>
      <StaffClient />
    </div>
  );
}
