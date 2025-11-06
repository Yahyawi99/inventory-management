import MainLayout from "@/layouts/main/layout";
import { AuthProvider, ThemeProvider } from "@/context";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayout>{children}</MainLayout>;
      </AuthProvider>
    </ThemeProvider>
  );
}
