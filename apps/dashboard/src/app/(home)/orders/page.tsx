"use client";

import { fetchOrders } from "@services/application/orders";
import { useEffect, useState } from "react";

const page = () => {
  const [data, setData] = useState([]);

  const fetch = async () => {
    const res = await fetchOrders();

    setData(res);
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);
  return <div>page</div>;
};

export default page;
