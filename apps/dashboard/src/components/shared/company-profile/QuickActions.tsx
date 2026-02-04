import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "app-core/src/components";
import { FileText, Package, Truck, Users } from "lucide-react";

export default function Actions() {
  const t = useTranslations("company_profile_page.sidebar");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("subtitle")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          <Link href={"/en/users-roles/manage-users"}>
            <Button className="w-full justify-start mb-2" variant="default">
              <Users className="w-4 h-4 mr-2" />
              {t("actions.invite_member")}
            </Button>
          </Link>

          <Link href={"/en/inventory/products"}>
            <Button className="w-full justify-start mb-2" variant="outline">
              <Package className="w-4 h-4 mr-2" />
              {t("actions.add_products")}
            </Button>
          </Link>

          <Link href={"/en/orders"}>
            <Button className="w-full justify-start mb-2" variant="outline">
              <Truck className="w-4 h-4 mr-2" />
              {t("actions.manage_orders")}
            </Button>
          </Link>

          <Link href={"/en/reports"}>
            <Button className="w-full justify-start mb-2" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              {t("actions.generate_reports")}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
