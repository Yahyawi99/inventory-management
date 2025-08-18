"use client";

import { useEffect, useState } from "react";
import { fetchOrders } from "@services/application/orders";
import { useAuth } from "@/hooks/useAuth";

const page = () => {
  const [data, setData] = useState([]);
  const { user } = useAuth();

  const fetch = async () => {
    const res = await fetchOrders();

    setData(res);
  };

  useEffect(() => {
    fetch();

    console.log(user);
  }, [user]);

  useEffect(() => {
    console.log(data);
  }, [data]);
  return <div>page</div>;
};

export default page;
