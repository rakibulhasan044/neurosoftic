import { Metadata } from "next";
import { ChangePasswordContent } from "@/components/modules/auth/ChangePasswordContent";

export const metadata: Metadata = {
  title: "Change Password | Neurosoftic",
  description: "Set a new password for your account.",
};

export default function ChangePasswordPage() {
  return <ChangePasswordContent />;
}
