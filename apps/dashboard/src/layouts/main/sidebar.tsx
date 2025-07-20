// "use client";

// import ProfileCardMenu from "@/layouts/carbon/profile-card-menu";
// import WorkSpaceSwitcher from "@/layouts/carbon/work-space-switcher";
// import Logo from "@core/components/logo";
// import cn from "@core/utils/class-names";
// import dynamic from "next/dynamic";
// import Link from "next/link";
// import { PiDotsThreeVerticalBold, PiHeadsetBold } from "react-icons/pi";
import SidebarMenu from "./sidebar-menu";

// const NeedSupport = dynamic(() => import("@/layouts/carbon/need-support"), {
//   ssr: false,
// });

export function Sidebar({ className }: { className?: string }) {
  return <SidebarMenu />;
}
