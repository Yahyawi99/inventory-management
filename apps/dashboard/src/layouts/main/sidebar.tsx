"use client";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/context/AuthContext";
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
        <Footer user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

const Header = () => {
  return (
    <div className="flex justify-between items-center pt-1 pb-0 mb-5 border-b-2">
      <div className="flex items-center">
        <Image
          src={"/assets/icons/logo.png"}
          width={75}
          height={75}
          alt="WareFlow-logo"
        />

        <h1 className="text-3xl text-(--color-secondary) h-[35px]">WareFlow</h1>
      </div>

      <div>
        <SidebarTrigger className="cursor-pointer mt-[10px]">
          <FontAwesomeIcon
            icon={faClose}
            className="text-(--color-secondary)"
          />
        </SidebarTrigger>
      </div>
    </div>
  );
};

const Footer = ({ user }: { user: User | null }) => {
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
          className="w-[50px] h-[50px] rounded-3xl"
        />

        <div className="text-[.9rem] text-[#1B3B6F] font-bold">
          <p>{user?.name}</p>
          <p>{user?.email}</p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="cursor-pointer outline-none">
          <FontAwesomeIcon
            icon={faEllipsisV}
            className="text-(--ring) cursor-pointer px-3"
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuLabel className="font-black">
            My Account
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <Link href={"/en/account"}>
            <DropdownMenuItem className="cursor-pointer">
              Account
            </DropdownMenuItem>
          </Link>
          <Link href={"/en/account/activity"}>
            <DropdownMenuItem className="cursor-pointer">
              My Activity
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <Link href={"/en/account/billing"}>
            <DropdownMenuItem className="cursor-pointer">
              Billing & Subscriptions
            </DropdownMenuItem>
          </Link>
          <Link href={"/en/account/premissions"}>
            <DropdownMenuItem className="cursor-pointer">
              Users & Permissions
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <Link href={"/en/account/settings"}>
            <DropdownMenuItem className="cursor-pointer">
              Settings
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={onLogOutHandler}
          >
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
