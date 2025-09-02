"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
// sections
import Cards from "@/shared/Dashboard/Cards";
import Charts from "@/shared/Dashboard/Charts";
import RecentActivity from "@/shared/Dashboard/activity";
import Action from "@/shared/Dashboard/ActionBtns";
import Header from "@/layouts/main/header";

export default function Dashboard() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      return router.replace(`/auth/sign-in`);
    }
  }, [isAuthenticated, isAuthLoading]);

  return (
    <>
      <Header />

      <section className="flex flex-col gap-8">
        <Cards />
        <Charts />
        <RecentActivity />
        <Action />
      </section>
    </>
  );
}
