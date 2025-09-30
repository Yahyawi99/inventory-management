"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Input,
  Textarea,
  Button,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "app-core/src/components";
import {
  Upload,
  Edit,
  Check,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  RefreshCw,
} from "lucide-react";

const initialOrgData = {
  id: "org_123456",
  name: "LogiTech Solutions",
  slug: "logitech-solutions",
  logo: null,
  email: "info@logitech-solutions.com",
  phone: "+1 (555) 789-0123",
  address: "1234 Industrial Blvd, Denver, CO 80202",
  createdAt: "2023-01-15T09:00:00Z",
  updatedAt: "2024-12-01T10:30:00Z",
};

export default function OrganizationInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [orgData, setOrgData] = useState(initialOrgData);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setOrgData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 1000));
    setIsLoading(false);
    setIsEditing(false);
    console.log("Saved:", orgData);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("");

  return (
    <Card className="mb-2 text-[14px]">
      <CardHeader className="flex justify-between">
        <CardTitle>Organization Details</CardTitle>
        {!isEditing ? (
          <Button
            className="bg-sidebar hover:bg-sidebar hover:opacity-75"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="w-4 h-4 mr-2 " />
            Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              className="bg-sidebar hover:bg-sidebar hover:opacity-75"
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Save
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="w-20 h-20">
            <AvatarImage src={orgData.logo ?? undefined} />
            <AvatarFallback className="text-[16px] bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-semibold text-white">
              {getInitials(orgData.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className=" font-semibold">{orgData.name}</h2>
            <p className="text-gray-500">@{orgData.slug}</p>
            <Badge variant="outline">ID: {orgData.id}</Badge>
          </div>
          {isEditing && (
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Logo
            </Button>
          )}
        </div>

        {/* Name + Slug */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Name</Label>
            {isEditing ? (
              <Input
                value={orgData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            ) : (
              <div className="p-2 bg-gray-50 rounded">{orgData.name}</div>
            )}
          </div>
          <div>
            <Label>Slug</Label>
            {isEditing ? (
              <Input
                value={orgData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
              />
            ) : (
              <div className="p-2 text- bg-gray-50 rounded">{orgData.slug}</div>
            )}
          </div>
        </div>

        {/* Email + Phone */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Email</Label>
            {isEditing ? (
              <Input
                value={orgData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            ) : (
              <div className="flex items-center p-2 bg-gray-50 rounded">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                {orgData.email}
              </div>
            )}
          </div>
          <div>
            <Label>Phone</Label>
            {isEditing ? (
              <Input
                value={orgData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            ) : (
              <div className="flex items-center p-2 bg-gray-50 rounded">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                {orgData.phone}
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <Label>Address</Label>
          {isEditing ? (
            <Textarea
              value={orgData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
            />
          ) : (
            <div className="flex p-2 bg-gray-50 rounded">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              {orgData.address}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Created: {formatDate(orgData.createdAt)}
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            Updated: {formatDate(orgData.updatedAt)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
