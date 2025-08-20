import MainLayout from "@/layouts/main/layout";
import { AuthProvider } from "@/context/AuthContext";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <MainLayout>{children}</MainLayout>;
    </AuthProvider>
  );
}
