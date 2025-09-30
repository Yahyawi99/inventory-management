// import React, { useState } from "react";
// import {
//   Building2,
//   Mail,
//   Phone,
//   MapPin,
//   Upload,
//   Users,
//   Package,
//   ShoppingCart,
//   Truck,
//   Clock,
//   FileText,
//   RefreshCw,
//   Edit,
//   Check,
//   X,
//   Calendar,
//   AlertCircle,
//   TrendingUp,
//   BarChart4,
//   ChevronRight,
//   Hash,
// } from "lucide-react";

// // ====================================================================
// // START: MOCK UI PRIMITIVES (Simulating @/components/ui/* using Tailwind)
// // ====================================================================

// const Card = ({ children, className = "" }) => (
//   <div
//     className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
//   >
//     {children}
//   </div>
// );
// const CardHeader = ({ children, className = "" }) => (
//   <div className={`p-6 border-b border-gray-100 ${className}`}>{children}</div>
// );
// const CardTitle = ({ children, className = "" }) => (
//   <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
//     {children}
//   </h2>
// );
// const CardDescription = ({ children, className = "" }) => (
//   <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>
// );
// const CardContent = ({ children, className = "" }) => (
//   <div className={`p-6 ${className}`}>{children}</div>
// );

// const Button = ({
//   children,
//   variant = "default",
//   size = "default",
//   className = "",
//   onClick,
//   disabled = false,
// }) => {
//   let baseStyles =
//     "flex items-center justify-center font-medium rounded-xl transition duration-200 ease-in-out whitespace-nowrap";
//   let sizeStyles =
//     size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base";
//   let variantStyles = "";

//   switch (variant) {
//     case "outline":
//       variantStyles =
//         "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400";
//       break;
//     case "ghost":
//       variantStyles =
//         "bg-transparent text-gray-600 hover:bg-gray-100 disabled:text-gray-400";
//       break;
//     default: // 'default' / 'primary'
//       variantStyles =
//         "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 shadow-md shadow-blue-500/30";
//   }

//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
//     >
//       {children}
//     </button>
//   );
// };

// const Input = (props) => (
//   <input
//     {...props}
//     className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ${
//       props.className || ""
//     }`}
//   />
// );

// const Label = ({ htmlFor, children, className = "" }) => (
//   <label
//     htmlFor={htmlFor}
//     className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}
//   >
//     {children}
//   </label>
// );

// const Textarea = (props) => (
//   <textarea
//     {...props}
//     className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 resize-y ${
//       props.className || ""
//     }`}
//   />
// );

// const Badge = ({ children, variant = "default", className = "" }) => {
//   let variantStyles = "bg-gray-100 text-gray-800";
//   switch (variant) {
//     case "default":
//       variantStyles = "bg-blue-100 text-blue-800 font-bold";
//       break;
//     case "secondary":
//       variantStyles = "bg-purple-100 text-purple-800 font-bold";
//       break;
//     case "outline":
//       variantStyles =
//         "bg-white border border-gray-200 text-gray-600 font-medium";
//       break;
//   }
//   return (
//     <span
//       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantStyles} ${className}`}
//     >
//       {children}
//     </span>
//   );
// };

// const Avatar = ({ children, className = "" }) => (
//   <div
//     className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
//   >
//     {children}
//   </div>
// );
// const AvatarImage = (props) => (
//   <img {...props} className="aspect-square h-full w-full" />
// );
// const AvatarFallback = (props) => (
//   <div
//     {...props}
//     className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 ${
//       props.className || ""
//     }`}
//   />
// );

// const Alert = ({ children }) => (
//   <div className="flex items-start p-4 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-200">
//     {children}
//   </div>
// );
// const AlertDescription = ({ children }) => (
//   <div className="text-sm ml-3">{children}</div>
// );
// const Separator = () => <div className="h-px w-full bg-gray-200 my-4"></div>;

// // ====================================================================
// // END: MOCK UI PRIMITIVES
// // ====================================================================

// // --- Helper Functions ---
// const formatDate = (dateString) => {
//   if (!dateString) return "N/A";
//   return new Date(dateString).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//   });
// };

// const getInitials = (name) => {
//   if (!name) return "??";
//   return name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase();
// };

// const getRoleBadgeVariant = (role) => {
//   switch (role) {
//     case "ADMIN":
//       return "default";
//     case "MANAGER":
//       return "secondary";
//     case "STAFF":
//       return "outline";
//     default:
//       return "outline";
//   }
// };

// // ====================================================================
// // 1. PROFILE HEADER COMPONENT
// // ====================================================================

// const ProfileHeader = ({
//   isEditing,
//   setIsEditing,
//   isLoading,
//   handleSave,
//   handleCancel,
// }) => (
//   <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
//     <div>
//       <h1 className="text-3xl font-bold text-gray-900">Company Profile</h1>
//       <p className="text-gray-600 mt-1">
//         Manage your organization information and team settings.
//       </p>
//     </div>
//     {!isEditing ? (
//       <Button onClick={() => setIsEditing(true)}>
//         <Edit className="w-4 h-4 mr-2" />
//         Edit Profile
//       </Button>
//     ) : (
//       <div className="flex space-x-2">
//         <Button variant="outline" onClick={handleCancel}>
//           <X className="w-4 h-4 mr-2" />
//           Cancel
//         </Button>
//         <Button onClick={handleSave} disabled={isLoading}>
//           {isLoading ? (
//             <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
//           ) : (
//             <Check className="w-4 h-4 mr-2" />
//           )}
//           Save Changes
//         </Button>
//       </div>
//     )}
//   </div>
// );

// // ====================================================================
// // 2. GENERAL INFO (TAB CONTENT)
// // ====================================================================

// const GeneralInfoSection = ({
//   orgData,
//   isEditing,
//   handleInputChange,
//   getInitials,
// }) => (
//   <Card>
//     <CardHeader>
//       <div className="flex items-start justify-between">
//         <div className="flex items-center space-x-4">
//           <Avatar className="w-20 h-20">
//             <AvatarImage src={orgData.logo} />
//             <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-semibold">
//               {getInitials(orgData.name)}
//             </AvatarFallback>
//           </Avatar>
//           <div>
//             <CardTitle className="text-2xl">{orgData.name}</CardTitle>
//             <p className="text-sm text-gray-500 mt-1">
//               <Hash className="inline w-3 h-3 mr-0.5 text-gray-400" />
//               {orgData.slug}
//             </p>
//             <Badge variant="outline" className="mt-2 text-xs">
//               ID: {orgData.id}
//             </Badge>
//           </div>
//         </div>
//         {isEditing && (
//           <Button variant="outline" size="sm">
//             <Upload className="w-4 h-4 mr-2" />
//             Upload Logo
//           </Button>
//         )}
//       </div>
//     </CardHeader>
//     <CardContent className="space-y-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Name & Slug */}
//         <div className="space-y-2">
//           <Label htmlFor="org-name">Organization Name</Label>
//           {isEditing ? (
//             <Input
//               id="org-name"
//               value={orgData.name}
//               onChange={(e) => handleInputChange("name", e.target.value)}
//             />
//           ) : (
//             <div className="px-4 py-2 bg-gray-50 rounded-lg font-medium text-gray-900">
//               {orgData.name}
//             </div>
//           )}
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="org-slug">URL Slug</Label>
//           {isEditing ? (
//             <Input
//               id="org-slug"
//               value={orgData.slug}
//               onChange={(e) => handleInputChange("slug", e.target.value)}
//               placeholder="your-company-name"
//             />
//           ) : (
//             <div className="px-4 py-2 bg-gray-50 rounded-lg font-medium text-gray-900">
//               {orgData.slug}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Email */}
//         <div className="space-y-2">
//           <Label htmlFor="org-email">Email Address</Label>
//           {isEditing ? (
//             <div className="relative">
//               <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
//               <Input
//                 id="org-email"
//                 type="email"
//                 value={orgData.email}
//                 onChange={(e) => handleInputChange("email", e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           ) : (
//             <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
//               <Mail className="w-5 h-5 text-gray-400 mr-3" />
//               <span className="font-medium text-gray-900">{orgData.email}</span>
//             </div>
//           )}
//         </div>
//         {/* Phone */}
//         <div className="space-y-2">
//           <Label htmlFor="org-phone">Phone Number</Label>
//           {isEditing ? (
//             <div className="relative">
//               <Phone className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
//               <Input
//                 id="org-phone"
//                 type="tel"
//                 value={orgData.phone}
//                 onChange={(e) => handleInputChange("phone", e.target.value)}
//                 className="pl-10"
//               />
//             </div>
//           ) : (
//             <div className="flex items-center px-4 py-2 bg-gray-50 rounded-lg">
//               <Phone className="w-5 h-5 text-gray-400 mr-3" />
//               <span className="font-medium text-gray-900">{orgData.phone}</span>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Address */}
//       <div className="space-y-2">
//         <Label htmlFor="org-address">Address</Label>
//         {isEditing ? (
//           <Textarea
//             id="org-address"
//             value={orgData.address}
//             onChange={(e) => handleInputChange("address", e.target.value)}
//             rows={3}
//           />
//         ) : (
//           <div className="flex items-start px-4 py-2 bg-gray-50 rounded-lg">
//             <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
//             <span className="font-medium text-gray-900">{orgData.address}</span>
//           </div>
//         )}
//       </div>

//       {/* Timestamps */}
//       <div className="pt-4 border-t">
//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <div>
//             <p className="text-gray-500">Created</p>
//             <p className="font-medium text-gray-900 mt-1 flex items-center">
//               <Calendar className="w-4 h-4 mr-2 text-gray-400" />
//               {formatDate(orgData.createdAt)}
//             </p>
//           </div>
//           <div>
//             <p className="text-gray-500">Last Updated</p>
//             <p className="font-medium text-gray-900 mt-1 flex items-center">
//               <Clock className="w-4 h-4 mr-2 text-gray-400" />
//               {formatDate(orgData.updatedAt)}
//             </p>
//           </div>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

// // ====================================================================
// // 3. OVERVIEW METRICS (TAB CONTENT)
// // ====================================================================

// const OverviewMetricsSection = ({ stats }) => (
//   <Card>
//     <CardHeader>
//       <CardTitle>Organization Overview</CardTitle>
//       <CardDescription>
//         Key metrics and statistics of your operations.
//       </CardDescription>
//     </CardHeader>
//     <CardContent>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//         {stats.map((stat, index) => {
//           const Icon = stat.icon;
//           return (
//             <div
//               key={index}
//               className="p-5 border rounded-xl hover:shadow-lg transition-shadow bg-gray-50/50"
//             >
//               <div className="flex items-center justify-between mb-3">
//                 <p className="text-sm text-gray-600">{stat.label}</p>
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color}`}
//                 >
//                   <Icon className="w-4 h-4" />
//                 </div>
//               </div>
//               <p className="text-3xl font-extrabold text-gray-900">
//                 {stat.value}
//               </p>
//               <p className="text-xs text-blue-600 mt-1 flex items-center font-medium">
//                 <TrendingUp className="w-3 h-3 mr-1" />
//                 {stat.change}
//               </p>
//             </div>
//           );
//         })}
//       </div>
//     </CardContent>
//   </Card>
// );

// // ====================================================================
// // 4. TEAM MANAGEMENT (TAB CONTENT)
// // ====================================================================

// const TeamManagementSection = ({
//   recentMembers,
//   pendingInvitations,
//   getInitials,
//   getRoleBadgeVariant,
//   formatDate,
// }) => (
//   <div className="space-y-6">
//     {/* Team Members */}
//     <Card>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <div>
//             <CardTitle>Recent Team Members</CardTitle>
//             <CardDescription>
//               Last active and recently joined team members.
//             </CardDescription>
//           </div>
//           <Button variant="outline" size="sm">
//             <Users className="w-4 h-4 mr-2" />
//             Manage Members
//           </Button>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-3">
//           {recentMembers.map((member, index) => (
//             <div
//               key={index}
//               className="flex items-center justify-between p-3 border rounded-xl hover:bg-blue-50/50 transition-colors"
//             >
//               <div className="flex items-center space-x-3">
//                 <Avatar className="w-10 h-10">
//                   <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
//                     {getInitials(member.name)}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-medium text-gray-900">{member.name}</p>
//                   <p className="text-sm text-gray-500">{member.email}</p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <Badge variant={getRoleBadgeVariant(member.role)}>
//                   {member.role}
//                 </Badge>
//                 <p className="text-xs text-gray-500 hidden sm:block">
//                   Joined: {formatDate(member.joinedAt)}
//                 </p>
//                 <Button variant="ghost" size="sm">
//                   <ChevronRight className="w-4 h-4 text-gray-400" />
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>

//     {/* Pending Invitations */}
//     {pendingInvitations.length > 0 && (
//       <Card className="border-amber-300 bg-amber-50">
//         <CardHeader className="border-amber-300">
//           <CardTitle className="text-amber-800">
//             Pending Invitations ({pendingInvitations.length})
//           </CardTitle>
//           <CardDescription className="text-amber-700">
//             Invites sent awaiting acceptance.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             {pendingInvitations.map((invitation, index) => (
//               <div
//                 key={index}
//                 className="flex items-center justify-between p-3 border border-amber-300 bg-white rounded-lg"
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
//                     <Mail className="w-5 h-5 text-amber-600" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900">
//                       {invitation.email}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Expires: {formatDate(invitation.expiresAt)}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2 flex-shrink-0">
//                   <Badge variant={getRoleBadgeVariant(invitation.role)}>
//                     {invitation.role}
//                   </Badge>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="hidden md:flex"
//                   >
//                     Resend
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-red-600 hover:bg-red-50"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     )}
//   </div>
// );

// // ====================================================================
// // 5. RIGHT SIDEBAR (Quick Actions, Health, Activity)
// // ====================================================================

// const SidebarRight = () => (
//   <div className="space-y-6">
//     {/* Quick Actions */}
//     <Card>
//       <CardHeader>
//         <CardTitle>Quick Actions</CardTitle>
//         <CardDescription>Common organization tasks</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-3">
//         <Button className="w-full justify-start" variant="default">
//           <Users className="w-4 h-4 mr-2" />
//           Invite Team Member
//         </Button>
//         <Button className="w-full justify-start" variant="outline">
//           <Package className="w-4 h-4 mr-2" />
//           Add Products
//         </Button>
//         <Button className="w-full justify-start" variant="outline">
//           <Truck className="w-4 h-4 mr-2" />
//           Manage Suppliers
//         </Button>
//         <Button className="w-full justify-start" variant="outline">
//           <FileText className="w-4 h-4 mr-2" />
//           Generate Reports
//         </Button>
//       </CardContent>
//     </Card>

//     {/* Organization Health */}
//     <Card>
//       <CardHeader>
//         <CardTitle>Organization Health</CardTitle>
//         <CardDescription>System status and metrics</CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="flex items-center justify-between">
//           <span className="text-sm text-gray-600">Data Sync</span>
//           <Badge variant="outline" className="bg-green-50 text-green-700">
//             <Check className="w-3 h-3 mr-1" /> Synced
//           </Badge>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-sm text-gray-600">Storage Used</span>
//           <span className="text-sm font-medium text-gray-900">
//             2.4 GB / 10 GB
//           </span>
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-sm text-gray-600">Plan</span>
//           <Badge variant="default" className="bg-purple-500 text-white">
//             Professional
//           </Badge>
//         </div>
//         <Separator />
//         <Alert>
//           <AlertCircle className="h-4 w-4 text-yellow-700 mt-0.5" />
//           <AlertDescription>
//             Upgrade your plan to unlock 2x API call capacity.
//           </AlertDescription>
//         </Alert>
//       </CardContent>
//     </Card>

//     {/* Recent Activity */}
//     <Card>
//       <CardHeader>
//         <CardTitle>Recent Activity</CardTitle>
//         <CardDescription>Latest organization changes</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {[
//             { action: "New member added", user: "Admin", time: "2 hours ago" },
//             {
//               action: "Products imported",
//               user: "Sarah Johnson",
//               time: "5 hours ago",
//             },
//             {
//               action: "Supplier updated",
//               user: "Mike Chen",
//               time: "1 day ago",
//             },
//             {
//               action: "Stock location created",
//               user: "Admin",
//               time: "2 days ago",
//             },
//           ].map((activity, index) => (
//             <div key={index} className="flex items-start space-x-3">
//               <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm text-gray-900">{activity.action}</p>
//                 <div className="flex items-center space-x-2 mt-0.5">
//                   <p className="text-xs text-gray-500">{activity.user}</p>
//                   <span className="text-xs text-gray-400">•</span>
//                   <p className="text-xs text-gray-500">{activity.time}</p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   </div>
// );

// // ====================================================================
// // MAIN APPLICATION COMPONENT (State & Routing)
// // ====================================================================

// const CompanyProfilePage = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("General"); // New state for navigation

//   // Organization data based on schema (kept separate from edit state for easy rollback)
//   const [orgData, setOrgData] = useState({
//     id: "org_123456",
//     name: "LogiTech Solutions",
//     slug: "logitech-solutions",
//     logo: null,
//     email: "info@logitech-solutions.com",
//     phone: "+1 (555) 789-0123",
//     address: "1234 Industrial Blvd, Denver, CO 80202",
//     metadata: JSON.stringify({ industry: "Technology", founded: "2020" }),
//     createdAt: "2023-01-15T09:00:00Z",
//     updatedAt: "2024-12-01T10:30:00Z",
//   });

//   const [editableOrgData, setEditableOrgData] = useState(orgData);

//   // Organization statistics
//   const stats = [
//     {
//       label: "Team Members",
//       value: "24",
//       icon: Users,
//       color: "bg-blue-50 text-blue-600",
//       change: "+3 this month",
//     },
//     {
//       label: "Products",
//       value: "2,847",
//       icon: Package,
//       color: "bg-green-50 text-green-600",
//       change: "+127 this week",
//     },
//     {
//       label: "Active Orders",
//       value: "156",
//       icon: ShoppingCart,
//       color: "bg-purple-50 text-purple-600",
//       change: "12 pending",
//     },
//     {
//       label: "Suppliers",
//       value: "48",
//       icon: Truck,
//       color: "bg-orange-50 text-orange-600",
//       change: "+5 this month",
//     },
//     {
//       label: "Stock Locations",
//       value: "12",
//       icon: MapPin,
//       color: "bg-pink-50 text-pink-600",
//       change: "3 warehouses",
//     },
//     {
//       label: "Customers",
//       value: "342",
//       icon: Users,
//       color: "bg-indigo-50 text-indigo-600",
//       change: "+18 this month",
//     },
//   ];

//   // Recent members and pending invitations
//   const recentMembers = [
//     {
//       name: "Sarah Johnson",
//       role: "MANAGER",
//       email: "sarah.j@logitech.com",
//       joinedAt: "2023-01-15",
//       status: "Active",
//     },
//     {
//       name: "Mike Chen",
//       role: "ADMIN",
//       email: "mike.c@logitech.com",
//       joinedAt: "2023-02-20",
//       status: "Active",
//     },
//     {
//       name: "Emily Davis",
//       role: "STAFF",
//       email: "emily.d@logitech.com",
//       joinedAt: "2023-03-10",
//       status: "Active",
//     },
//     {
//       name: "James Wilson",
//       role: "STAFF",
//       email: "james.w@logitech.com",
//       joinedAt: "2023-04-05",
//       status: "Active",
//     },
//   ];
//   const pendingInvitations = [
//     {
//       email: "john.smith@example.com",
//       role: "STAFF",
//       status: "Pending",
//       expiresAt: "2024-12-15T23:59:59Z",
//     },
//     {
//       email: "lisa.brown@example.com",
//       role: "MANAGER",
//       status: "Pending",
//       expiresAt: "2024-12-20T23:59:59Z",
//     },
//   ];

//   const handleInputChange = (field, value) => {
//     setEditableOrgData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     // Simulate API call delay
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     // Update main state
//     setOrgData(editableOrgData);
//     setIsLoading(false);
//     setIsEditing(false);
//     console.log("Saving organization data:", editableOrgData);
//   };

//   const handleCancel = () => {
//     // Revert editable state back to the original saved state
//     setEditableOrgData(orgData);
//     setIsEditing(false);
//   };

//   const navigation = [
//     { name: "General Information", icon: Building2, key: "General" },
//     { name: "Overview & Metrics", icon: BarChart4, key: "Overview" },
//     { name: "Team Management", icon: Users, key: "Team" },
//   ];

//   const renderContent = () => {
//     switch (activeTab) {
//       case "General":
//         return (
//           <GeneralInfoSection
//             orgData={isEditing ? editableOrgData : orgData}
//             isEditing={isEditing}
//             handleInputChange={handleInputChange}
//             getInitials={getInitials}
//           />
//         );
//       case "Overview":
//         return <OverviewMetricsSection stats={stats} />;
//       case "Team":
//         return (
//           <TeamManagementSection
//             recentMembers={recentMembers}
//             pendingInvitations={pendingInvitations}
//             getInitials={getInitials}
//             getRoleBadgeVariant={getRoleBadgeVariant}
//             formatDate={formatDate}
//           />
//         );
//       default:
//         return (
//           <GeneralInfoSection
//             orgData={orgData}
//             isEditing={isEditing}
//             handleInputChange={handleInputChange}
//             getInitials={getInitials}
//           />
//         );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Header with Edit/Save Controls */}
//         <ProfileHeader
//           isEditing={isEditing}
//           setIsEditing={setIsEditing}
//           isLoading={isLoading}
//           handleSave={handleSave}
//           handleCancel={handleCancel}
//         />

//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//           {/* Left Column - Navigation Sidebar (Mobile: hidden, Tablet/Desktop: 3/12 width) */}
//           <div className="lg:col-span-3">
//             <Card className="p-0 sticky top-4">
//               <nav className="space-y-1 p-3">
//                 <h3 className="text-xs font-semibold uppercase text-gray-400 px-3 py-2">
//                   Settings
//                 </h3>
//                 {navigation.map((item) => (
//                   <a
//                     key={item.key}
//                     onClick={() => setActiveTab(item.key)}
//                     className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors ${
//                       activeTab === item.key
//                         ? "bg-blue-50 text-blue-700 font-semibold"
//                         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//                     }`}
//                   >
//                     <item.icon className="w-5 h-5 mr-3" />
//                     <span className="text-sm">{item.name}</span>
//                   </a>
//                 ))}
//               </nav>
//             </Card>
//           </div>

//           {/* Middle Column - Tab Content (Tablet/Desktop: 5/12 width) */}
//           <div className="lg:col-span-5 space-y-6">{renderContent()}</div>

//           {/* Right Column - Quick Actions & Health (Tablet/Desktop: 4/12 width) */}
//           <div className="lg:col-span-4 space-y-6">
//             <SidebarRight />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CompanyProfilePage;
