"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSidebar } from "@/components/ui/sidebar";

export default function Header() {
  const { open } = useSidebar();
  return (
    <header className="flex items-center justify-between py-[20px]">
      <div className="flex items-center">
        <SidebarTrigger className="cursor-pointer">
          {open ? (
            <FontAwesomeIcon icon={faAngleLeft} className="scale-140" />
          ) : (
            <FontAwesomeIcon icon={faAngleRight} className="scale-140" />
          )}
        </SidebarTrigger>

        <hr className="rotate-180 w-[5px] h-full" />

        <h1>Hello, Yassine Yahyawi</h1>
      </div>
    </header>
  );
}
