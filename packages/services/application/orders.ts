import api from "../../utils/axios";

export const fetchOrders = async () => {
  const { data } = await api.get("/orders");
  return data;
};
