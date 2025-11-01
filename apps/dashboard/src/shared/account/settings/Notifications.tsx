"use client";

import React, { useState, useMemo } from "react";
import { Bell, CheckCircle, MailOpen, Clock, X } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ScrollArea,
} from "app-core/src/components";
import { getIconAndColor, formatTime } from "@/utils/notifications";

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

const NotificationItem = ({ notification, onToggleRead, onDelete }: any) => {
  const { icon: Icon, color, badge } = getIconAndColor(notification.type);
  const isRead = notification.read;

  return (
    <div
      className={`
                flex items-center p-4 transition-all duration-150 rounded-lg cursor-pointer border-b border-gray-100
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
            isRead ? "font-normal" : "font-medium text-gray-900"
          }`}
        >
          {notification.title}
        </div>
        <p
          className={`text-xs mt-1 ${
            isRead ? "text-muted-foreground" : "text-gray-600"
          }`}
        >
          {notification.message}
        </p>
        <div className="flex items-center mt-1 text-xs text-gray-400">
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
};

// Main
export default function Notification() {
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
        <h4 className="text-sm font-semibold text-gray-500 mb-2 px-4">
          {title}
        </h4>
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
    <div className="p-4 sm:p-8 md:p-12">
      <div className="max-w-3xl mx-auto">
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
                  <p className="font-semibold text-lg">
                    You are all caught up!
                  </p>
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
      </div>
    </div>
  );
}
