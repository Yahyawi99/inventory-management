"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSidebar } from "@/components/ui/sidebar";

export default function Header() {
  const { open } = useSidebar();

  return (
    <header className="flex items-center justify-between w- py-0.5">
      <div className="flex items-center m-4">
        <h1>
          Hello, <span className="underline">Yassine Yahyawi</span>
        </h1>
      </div>
    </header>
  );
}
