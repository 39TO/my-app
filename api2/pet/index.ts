import { createApiClient } from "../schema/client";

export const readPet = async (pet_id: string) => {
  const api = createApiClient({
    path: "/pets",
    httpMethod: "get",
    params: { query: { limit: 2 } },
  });
  const res = await api.request();
  if (res.type === "ok") {
    return res.data;
  } else {
    throw new Error(res.error.message);
  }
};
