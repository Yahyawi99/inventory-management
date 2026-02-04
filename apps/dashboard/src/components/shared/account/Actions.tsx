import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Alert,
  AlertDescription,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "app-core/src/components";
import { BarChart3, Package, ShoppingCart, Truck } from "lucide-react";

export default function Actions({
  twoFactorEnabled,
}: {
  twoFactorEnabled: boolean;
}) {
  const t = useTranslations("my_account_page.sidebar");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl"> {t("title")}</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-3 sm:gap-4">
          <Link href={"/en/inventory/products"}>
            <Button className="w-full justify-start" variant="default">
              <Package className="w-4 h-4 mr-2" />{" "}
              {t("actions.manage_products")}
            </Button>
          </Link>

          <Link href={"/en/orders"}>
            <Button className="w-full justify-start" variant="outline">
              <ShoppingCart className="w-4 h-4 mr-2" />{" "}
              {t("actions.view_orders")}
            </Button>
          </Link>

          <Link href={"/en/reports"}>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />{" "}
              {t("actions.generate_reports")}
            </Button>
          </Link>

          <Button className="w-full justify-start" variant="outline">
            <Truck className="w-4 h-4 mr-2" /> {t("actions.manage_suppliers")}
          </Button>
        </CardContent>
      </Card>

      {twoFactorEnabled && (
        <Alert>
          <AlertDescription>{t("security_note")}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
