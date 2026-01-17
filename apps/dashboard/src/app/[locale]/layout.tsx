import MainLayout from "@/layouts/main/layout";
import { AuthProvider, ThemeProvider } from "@/context";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

export default async function HomeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <AuthProvider>
      <ThemeProvider>
        <MainLayout>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </MainLayout>
        ;
      </ThemeProvider>
    </AuthProvider>
  );
}
