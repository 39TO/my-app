import { Result } from "./types";

export type ResponseError = {
  status: number;
  message: string;
};

const resp2result = async <T>(
  resp: Response
): Promise<Result<T, ResponseError>> => {
  const data = (await resp.json()) as T;
  if (!resp.ok) {
    return {
      type: "error",
      error: {
        status: resp.status,
        message: resp.statusText,
      },
    };
  }
  return { type: "ok", value: data };
};

export const apiClient = {
  get: async <T>(url: string, token?: string) => {
    const data = await fetch(url, {
      cache: "no-store",
      credentials: "include",
      method: "GET",
      headers: {
        ...(token && { jwt: token }),
      },
    });
    return await resp2result<T>(data);
  },
  post: async <T>(
    url: string,
    body: Record<string, unknown> | Record<string, unknown>[],
    token?: string
  ) => {
    const data = await fetch(url, {
      // cache: "no-store",
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { jwt: token }),
      },
      body: JSON.stringify(body),
    });
    return await resp2result<T>(data);
  },
  put: async <T>(
    url: string,
    body: Record<string, unknown> | Record<string, unknown>[],
    token?: string
  ) => {
    const data = await fetch(url, {
      cache: "no-store",
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { jwt: token }),
      },
      body: JSON.stringify(body),
    });
    return await resp2result<T>(data);
  },
  delete: async <T>(
    url: string,
    body?: Record<string, unknown> | Record<string, unknown>[],
    token?: string
  ) => {
    const data = await fetch(url, {
      cache: "no-store",
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { jwt: token }),
      },
      body: JSON.stringify(body),
    });
    return await resp2result<T>(data);
  },
};
