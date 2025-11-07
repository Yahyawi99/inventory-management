"use client";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useAuth, useTheme } from "@/context";
import { User } from "@/types/auth";
import { useRouter } from "next/navigation";
import { MenuItems } from "./sidebar-menu-items";
import SidebarMenu from "./sidebar-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
} from "app-core/src/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "app-core/src/components";
import { faClose, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function MainSidebar() {
  const { user } = useAuth();
  const { theme } = useTheme();

  return (
    <Sidebar>
      <SidebarHeader>
        <Header />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {MenuItems.map((item) => {
              return <SidebarMenu key={item.id} item={item} />;
            })}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Footer user={user} theme={theme} />
      </SidebarFooter>
    </Sidebar>
  );
}

const Header = () => {
  return (
    <div className="flex justify-between items-center pt-1 pb-0 mb-5 border-white border-b-2">
      <div className="flex items-center">
        <Image
          src={"/assets/icons/logo.png"}
          width={75}
          height={75}
          alt="WareFlow-logo"
        />

        <h1 className="text-3xl text-white h-[35px]">WareFlow</h1>
      </div>

      <div>
        <SidebarTrigger className="cursor-pointer mt-[10px]">
          <FontAwesomeIcon icon={faClose} className="text-white" />
        </SidebarTrigger>
      </div>
    </div>
  );
};

const Footer = ({ user, theme }: { user: User | null; theme: string }) => {
  const router = useRouter();

  const onLogOutHandler = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/sign-in");
        },
      },
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src={"/assets/images/luffy.jpg"}
          width={100}
          height={100}
          alt="user-avatar"
          className="w-[50px] h-[50px] rounded-3xl border-2 border-border"
        />

        <div className="text-[.8rem] text-background font-bold">
          <p>{user?.name}</p>
          <p>{user?.email}</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer outline-none">
          <FontAwesomeIcon
            icon={faEllipsisV}
            className="text-white cursor-pointer px-3"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className={`${
            theme === "dark" && "bg-[#151a26] text-[#ebeef5] border-[#262e3d]"
          } duration-0`}
        >
          <DropdownMenuLabel className="font-black">
            My Account
          </DropdownMenuLabel>

          <DropdownMenuSeparator
            className={`${theme === "dark" && "bg-[#262e3d]"}`}
          />

          <Link href={"/en/account"}>
            <DropdownMenuItem
              className={`cursor-pointer ${
                theme === "dark" && "focus:bg-[#262e3d] focus:text-[#ebeef5]"
              }`}
            >
              Account
            </DropdownMenuItem>
          </Link>

          <Link href={"/en/account/activity"}>
            <DropdownMenuItem
              className={`cursor-pointer ${
                theme === "dark" && "focus:bg-[#262e3d] focus:text-[#ebeef5]"
              }`}
            >
              My Activity
            </DropdownMenuItem>
          </Link>

          <Link href={"/en/account/billing"}>
            <DropdownMenuItem
              className={`cursor-pointer ${
                theme === "dark" && "focus:bg-[#262e3d] focus:text-[#ebeef5]"
              }`}
            >
              Billing & Subscriptions
            </DropdownMenuItem>
          </Link>
          <Link href={"/en/account/premissions"}>
            <DropdownMenuItem
              className={`cursor-pointer ${
                theme === "dark" && "focus:bg-[#262e3d] focus:text-[#ebeef5]"
              }`}
            >
              Users & Permissions
            </DropdownMenuItem>
          </Link>

          <Link href={"/en/account/settings"}>
            <DropdownMenuItem
              className={`cursor-pointer ${
                theme === "dark" && "focus:bg-[#262e3d] focus:text-[#ebeef5]"
              }`}
            >
              Settings
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem
            className={`cursor-pointer ${
              theme === "dark" && "focus:bg-[#262e3d] focus:text-[#ebeef5]"
            }`}
            onClick={onLogOutHandler}
          >
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
