"use client";

import { useParams } from "next/navigation";
import { OrderType } from "@database/generated/prisma";
import Main from "@/shared/orders/Main";
import Header from "@/layouts/main/header";

export default function Page() {
  const { type } = useParams<{ type: string }>();

  return (
    <>
      <Header />

      <Main type={type === "purchase" ? OrderType.PURCHASE : OrderType.SALES} />
    </>
  );
}
