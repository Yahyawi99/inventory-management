import { useTranslations } from "next-intl";
import Activity from "@/components/shared/account/activity";
import Header from "@/layouts/main/header";

export default function Page() {
  const t = useTranslations("my_activity_page.header");

  return (
    <>
      <Header />

      <div className="mb-4 mt-10">
        <h1 className="text-3xl font-semibold text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          {t("subtitle")}
        </p>
      </div>

      <Activity />
    </>
  );
}
