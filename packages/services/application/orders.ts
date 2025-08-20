import api from "../../utils/axios";

export const fetch = async (url: string) => {
  const response = await api.get(url);

  return response;
};
