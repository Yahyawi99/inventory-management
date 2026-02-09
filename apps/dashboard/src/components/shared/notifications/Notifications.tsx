"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Bell, CheckCircle, MailOpen } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ScrollArea,
} from "app-core/src/components";
import NotificationItem from "./NotificationItem";

const initialNotifications = [
  {
    id: 1,
    type: "order_created",
    entity: "Order",
    data: {
      code: "#1004",
    },
    level: "success",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 2,
    type: "document_uploaded",
    entity: "Document",
    data: {
      name: "Quarterly Report 2024",
    },
    level: "info",
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    read: false,
  },
  {
    id: 3,
    type: "low_stock",
    entity: "Product",
    data: {
      name: "X-20",
    },
    level: "warning",
    timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    read: false,
  },
  {
    id: 4,
    type: "user_registered",
    entity: "User",
    data: {
      name: "Sarah Connor",
    },
    level: "success",
    timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: 5,
    type: "system_maintenance",
    entity: "System",
    data: {},
    level: "info",
    timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: 6,
    type: "bug_fix_applied",
    entity: "System",
    data: {},
    level: "success",
    timestamp: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    read: true,
  },
];

export default function Main() {
  const t = useTranslations("notification_page");

  const [notifications, setNotifications] = useState(initialNotifications);

  const handleToggleRead = (id: any) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDeleteNotification = (id: any) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Grouping Logic
  const groupedNotifications = useMemo(() => {
    const groups = { Today: [], Yesterday: [], Older: [] };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    notifications
      .sort(
        (a, b) => Number(new Date(b.timestamp)) - Number(new Date(a.timestamp)),
      ) // Sort descending by time
      .forEach((n: any) => {
        const date = new Date(n.timestamp);
        if (date >= today) {
          groups.Today.push(n as never);
        } else if (date >= yesterday) {
          groups.Yesterday.push(n as never);
        } else {
          groups.Older.push(n as never);
        }
      });
    return groups;
  }, [notifications]);

  const renderGroup = (title: any, items: any) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-6">
        <h4 className="text-sm font-semibold mb-2 px-4">{title}</h4>
        <div className="space-y-1">
          {items.map((n: any) => (
            <NotificationItem
              key={n.id}
              notification={n}
              onToggleRead={handleToggleRead}
              onDelete={handleDeleteNotification}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="w-6 h-6 text-primary" />
          <CardTitle>{t("header.title")}</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} {t("unread")}
            </Badge>
          )}
        </div>
        <Button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          variant="secondary"
          size="sm"
        >
          <MailOpen className="w-4 h-4 mr-2" />
          {t("actions.mark_all_read")}
        </Button>
      </CardHeader>

      <ScrollArea className="h-[70vh] p-4">
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <CheckCircle className="w-10 h-10 mx-auto mb-4" />
              <p className="font-semibold text-lg">{t("empty_state.title")}</p>
              <p className="text-sm">{t("empty_state.description")}</p>
            </div>
          ) : (
            <div>
              {renderGroup("Today", groupedNotifications.Today)}
              {renderGroup("Yesterday", groupedNotifications.Yesterday)}
              {renderGroup("Older", groupedNotifications.Older)}
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
