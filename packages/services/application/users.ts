import api from "../../utils/axios";

export const fetchByEmail = async (url: string) => {
  const response = await api.post(url);

  return response;
};
