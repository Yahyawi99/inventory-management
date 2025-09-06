"use client";
import { useState } from "react";
import { roles } from "@/constants/users";
import {
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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

export default function Header() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Employee",
    emailVerified: false,
    twoFactorEnabled: false,
  });

  const handleAddUser = (userData: any) => {
    console.log("Attempting to add new user:", userData);
    // Add your API call or database operation here
    // Instead of an alert, use a custom modal in a real app
  };

  const handleChange = (e: any) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, role: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    handleAddUser(formData);
    // You can close the modal and reset the form after successful submission
    setIsAddModalOpen(false);
    setFormData({
      name: "",
      email: "",
      role: "Employee",
      emailVerified: false,
      twoFactorEnabled: false,
    });
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-semibold text-gray-800">Team Members (7)</h3>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center space-x-1 px-4 py-2 bg-sidebar hover:bg-transparent text-white font-semibold rounded-md shadow cursor-pointer border-2 border-transparent hover:border-sidebar hover:text-sidebar">
            <Plus className="h-4 w-4 mr-1" /> Add User
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[450px] rounded-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold">
              Add New User
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the new team member.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role Field */}
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={handleSelectChange} value={formData.role}>
                <SelectTrigger id="role" className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) =>
                    role !== "Super_Admin" ? (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ) : null
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Checkbox Fields */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="emailVerified"
                checked={formData.emailVerified}
                onCheckedChange={
                  (checked) => {}
                  // setFormData((prev) => ({ ...prev, emailVerified: checked }))
                }
              />
              <Label htmlFor="emailVerified">Email Verified</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="twoFactorEnabled"
                checked={formData.twoFactorEnabled}
                onCheckedChange={
                  (checked) => {}
                  // setFormData((prev) => ({
                  //   ...prev,
                  //   twoFactorEnabled: checked,
                  // }))
                }
              />
              <Label htmlFor="twoFactorEnabled">2FA Enabled</Label>
            </div>

            <DialogFooter className="pt-4 flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="rounded-full">
                Add User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
