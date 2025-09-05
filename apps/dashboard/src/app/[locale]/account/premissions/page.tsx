import UsersCard from "@/shared/account/premissions/Card";

export default function Page() {
  // Handler to add a new user
  // const handleAddUser = (e: any) => {
  //   e.preventDefault();
  //   if (!newUserName || !newUserEmail) return;

  //   const newUser = {
  //     id: `user-${Date.now()}`,
  //     name: newUserName,
  //     email: newUserEmail,
  //     role: newUserRole,
  //     status: "Active",
  //   };
  //   setUsers([...users, newUser]);
  //   setNewUserName("");
  //   setNewUserEmail("");
  //   setNewUserRole("Viewer");
  //   setIsAddModalOpen(false);
  // };

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-900">
            User & Permissions
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Manage your team's access, roles, and permissions.{" "}
          </p>
        </div>
      </div>

      <UsersCard />
    </div>
  );
}
