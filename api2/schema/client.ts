import {
  ApiBody,
  ApiPath,
  ApiPathParam,
  ApiQueryParam,
  ApiResponse,
  HttpMethod,
} from "./helper";

const SERVER_URL = "http://localhost:3000";

type CreateApiClientOption<Path extends ApiPath, Method extends HttpMethod> = {
  path: Path;
  httpMethod: Method;
  params?: {
    paths?: ApiPathParam<Path, Method>;
    query?: ApiQueryParam<Path, Method>;
    body?: ApiBody<Path, Method>;
  };
};

export type ResponseError = {
  status: number;
  message: string;
};

export type RequestResponse<Path extends ApiPath, Method extends HttpMethod> =
  | { type: "ok"; data: ApiResponse<Path, Method> }
  | { type: "error"; error: ResponseError };

export const createApiClient = <
  Path extends ApiPath,
  Method extends HttpMethod
>(
  option: CreateApiClientOption<Path, Method>
) => {
  const path = () => {
    // {trial_uid} などとなっているpathを実際の値に変換する
    const fullPath = Object.entries(option.params?.paths ?? {}).reduce(
      (prev, [key, value]) =>
        prev.replace(new RegExp(`\\{${key}\\}`), String(value)),
      option.path as string
    );

    const searchParam = new URLSearchParams();
    Object.entries(option.params?.query ?? {}).forEach(([key, value]) => {
      if (typeof value === "string") {
        searchParam.set(key, value);
      }
    });

    if (searchParam.toString().length > 0) {
      return fullPath + "?" + searchParam.toString();
    }

    return fullPath;
  };

  const request = async (): Promise<RequestResponse<Path, Method>> => {
    const res = await fetch(`${SERVER_URL}${path()}`, {
      cache: option.httpMethod == "get" ? "no-store" : "default",
      credentials: "include",
      method: option.httpMethod,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(option.params?.body),
    });
    const data = (await res.json()) as ApiResponse<Path, Method>;
    if (!res.ok) {
      return {
        type: "error",
        error: {
          status: res.status,
          message: res.statusText,
        },
      };
    }
    return {
      type: "ok",
      data,
    };
  };

  return { path, request };
};
