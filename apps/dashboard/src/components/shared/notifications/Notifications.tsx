"use client";

import React, { useState, useMemo } from "react";
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
    title: "New Order Received",
    message: "Order #1004 placed by Jane Doe.",
    type: "success",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 2,
    title: "Document Uploaded",
    message: "The Quarterly Report 2024 has been finalized.",
    type: "info",
    timestamp: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    read: false,
  },
  {
    id: 3,
    title: "Inventory Low Alert",
    message: "Product X-20 is below reorder level.",
    type: "warning",
    timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    read: false,
  },
  {
    id: 4,
    title: "New User Registered",
    message: "Welcome Sarah Connor to the platform.",
    type: "success",
    timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: 5,
    title: "System Maintenance",
    message: "Scheduled maintenance is complete.",
    type: "info",
    timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    read: true,
  },
  {
    id: 6,
    title: "Critical Bug Fix",
    message: "Patch 4.1.2 applied to resolve login issue.",
    type: "success",
    timestamp: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    read: true,
  },
];

export default function Main() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleToggleRead = (id: any) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
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
        (a, b) => Number(new Date(b.timestamp)) - Number(new Date(a.timestamp))
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
          <CardTitle>Notification Center</CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} Unread
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
          Mark All as Read
        </Button>
      </CardHeader>

      <ScrollArea className="h-[70vh] p-4">
        <CardContent className="p-0">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <CheckCircle className="w-10 h-10 mx-auto mb-4" />
              <p className="font-semibold text-lg">You are all caught up!</p>
              <p className="text-sm">No new notifications in your inbox.</p>
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
