import { useTranslations } from "next-intl";
import { formatTime, getIconAndColor } from "@/utils/notifications";
import { Button } from "app-core/src/components";
import { Clock, X } from "lucide-react";

export default function NotificationItem({
  notification,
  onToggleRead,
  onDelete,
}: any) {
  const { icon: Icon, color, badge } = getIconAndColor(notification.type);
  const isRead = notification.read;
  const t = useTranslations("notification_page.notification_item");

  return (
    <div
      className={`
                flex items-center p-4 transition-all duration-150 rounded-lg cursor-pointer border-b border-border
                ${
                  isRead
                    ? "bg-background text-muted-foreground"
                    : "bg-secondary/50 hover:bg-secondary text-card-foreground"
                }
            `}
      onClick={() => onToggleRead(notification.id)}
    >
      <div className={`p-2 rounded-full ${badge} flex-shrink-0 mr-4`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>

      <div className="flex-grow">
        <div
          className={`text-sm ${
            isRead ? "font-normal" : "font-medium text-foreground"
          }`}
        >
          {t(`types.${notification.type}.title`)}
        </div>
        <p
          className={`text-xs mt-1 ${
            isRead ? "text-muted-foreground" : "text-muted-foreground"
          }`}
        >
          {t(`types.${notification.type}.message`, {
            name: notification.data.name || "",
            code: notification.data.code || "",
          })}
        </p>
        <div className="flex items-center mt-1 text-xs text-muted-foreground/50">
          <Clock className="w-3 h-3 mr-1" />
          <span>{formatTime(notification.timestamp)}</span>
        </div>
      </div>

      <div className="flex space-x-2 items-center flex-shrink-0">
        {!isRead && (
          <div
            className="w-2 h-2 bg-primary rounded-full animate-pulse"
            title="Unread"
          ></div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="p-1 h-auto"
          title="Delete Notification"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
        >
          <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
    </div>
  );
}
