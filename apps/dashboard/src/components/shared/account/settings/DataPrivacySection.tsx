import { useTranslations } from "next-intl";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Switch,
  Alert,
  AlertDescription,
} from "app-core/src/components";
import { AlertTriangle, Download, Trash2, Upload } from "lucide-react";

export default function DataPrivacySection() {
  const t = useTranslations("personal_settings_page.data_privacy_section");
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("export_card.title")}</CardTitle>
          <CardDescription>{t("export_card.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-foreground">
                {t("export_card.export.title")}
              </p>
              <p className="text-sm text-gray-500">
                {t("export_card.export.subtitle")}
              </p>
            </div>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              {t("export_card.export.action")}
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <p className="font-medium text-foreground">
                {t("export_card.import.title")}
              </p>
              <p className="text-sm text-gray-500">
                {t("export_card.import.subtitle")}
              </p>
            </div>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              {t("export_card.import.action")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("privacy_card.title")}</CardTitle>
          <CardDescription>{t("privacy_card.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                {t("privacy_card.fields.activity_tracking.title")}
              </p>
              <p className="text-sm text-gray-500">
                {t("privacy_card.fields.activity_tracking.subtitle")}
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                {t("privacy_card.fields.usage_statistics.title")}
              </p>
              <p className="text-sm text-gray-500">
                {t("privacy_card.fields.usage_statistics.subtitle")}
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                {t("privacy_card.fields.marketing.title")}
              </p>
              <p className="text-sm text-gray-500">
                {t("privacy_card.fields.marketing.subtitle")}
              </p>
            </div>
            <Switch defaultChecked={true} />
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {t("delete_card.title")}
          </CardTitle>
          <CardDescription>{t("delete_card.subtitle")}</CardDescription>
        </CardHeader>

        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{t("delete_card.warning")}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              {t("delete_card.action")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
