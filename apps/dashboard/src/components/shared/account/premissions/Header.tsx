"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { roles } from "@/constants/users";
import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "app-core/src/components";
import { Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { UserRoles } from "@/types/users";

export default function Header() {
  const t = useTranslations("users_roles_page");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<{ email: string; role: UserRoles }>({
    email: "",
    role: "member",
  });

  const handleSelectChange = (key: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await authClient.organization.inviteMember({
        email: formData.email.toLowerCase().trim(),
        role: formData.role,
      });

      if (result.error) {
        setMessage(`Error: ${result.error.message}`);
      } else {
        setMessage(t("messages.success"));
        setFormData({ email: "", role: "member" });
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-semibold text-foreground">
        {t("users.title", {
          count: 7,
        })}
      </h3>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center space-x-1 px-4 py-2 bg-sidebar hover:bg-transparent text-white font-semibold rounded-md shadow cursor-pointer border-2 border-transparent hover:border-sidebar hover:text-sidebar">
            <Plus className="h-4 w-4 mr-1" /> {t("users.addUser")}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[450px] rounded-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold">
              {t("addUserModal.title")}
            </DialogTitle>
            <DialogDescription>
              {t("addUserModal.description")}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="email">{t("addUserModal.emailLabel")}</Label>
              <Input
                type="email"
                id="email"
                placeholder="colleague@example.com"
                value={formData.email}
                onChange={(e) => handleSelectChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">{t("addUserModal.roleLabel")}</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map(({ value, label }) => {
                    console.log(label);
                    return (
                      <SelectItem key={value} value={value}>
                        {t(`roles.${label.toLocaleLowerCase()}`)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full bg-sidebar border-2 border-sidebar hover:bg-transparent hover:text-sidebar"
              disabled={loading}
            >
              {loading ? t("addUserModal.sending") : t("addUserModal.send")}
            </Button>
          </form>

          {message && (
            <Alert
              variant={message.startsWith("Error") ? "destructive" : "default"}
              className="mt-4"
            >
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/*
export function InviteUserForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'analyst', label: 'Analyst' },
    { value: 'contributor', label: 'Contributor' },
    { value: 'employee', label: 'Employee' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await authClient.organization.invite({
        email: email.toLowerCase().trim(),
        role,
        // organizationId will use the active organization
      });

      if (result.error) {
        setMessage(`Error: ${result.error.message}`);
      } else {
        setMessage('Invitation sent successfully! The user will receive an email to create their account.');
        setEmail('');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Invite New Team Member</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="colleague@example.com"
          />
        </div>
        
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role *
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending Invitation...' : 'Send Invitation'}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.startsWith('Error') 
            ? 'bg-red-100 border border-red-400 text-red-700' 
            : 'bg-green-100 border border-green-400 text-green-700'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
  */
