import { paths } from "./_generated";

export type ApiPath = keyof paths;

// union( | ) to intersection( & )
type UnionToIntersection<T> = (T extends any ? (k: T) => void : never) extends (
  k: infer U
) => void
  ? U
  : never;

export type HttpMethod = "get" | "post" | "put" | "delete";
// 指定したパスが取りうるhttpメソッドを絞り込む
export type ExactHttpMethodByPath<Path extends ApiPath> = HttpMethod &
  keyof UnionToIntersection<paths[Path]>;

// 指定したhttpメソッドを取りうるパスを絞り込む
// key-remappingを使っている cf)https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as
export type ExactPathByHttpMethod<Method extends HttpMethod> =
  Method extends any
    ? keyof {
        [K in keyof paths as paths[K] extends Record<Method, any>
          ? K
          : never]: paths[K];
      }
    : never;

// ネストされたプロパティの型を取得する。
// ex) GetNestedValue<{ a: { b: { c: { someKey: someValue } } } }, ['a', 'b', 'c']> is { someKey: someValue }
type GetNestedValue<
  T extends Record<string, any>,
  Keys extends (string | number | symbol)[]
> = 0 extends Keys["length"]
  ? T
  : Keys extends [infer First, ...infer Rest]
  ? First extends keyof T
    ? Rest extends (string | number)[]
      ? GetNestedValue<Required<T[First]>, Rest>
      : never
    : never
  : never;

type GetContent<
  Path extends ApiPath,
  Method extends HttpMethod,
  Code extends number
> = GetNestedValue<
  paths,
  [Path, Method, "responses", Code, "content", "application/json"]
>;

export type ApiResponse<
  Path extends ApiPath,
  Method extends HttpMethod
> = GetContent<Path, Method, 200 | 201>;

export const httpErrorStatusCodes = [400, 401, 404, 500] as const;

export type ApiPathParam<
  Path extends ApiPath,
  Method extends HttpMethod
> = GetNestedValue<paths, [Path, Method, "parameters", "path"]>;

export type ApiQueryParam<
  Path extends ApiPath,
  Method extends HttpMethod
> = GetNestedValue<paths, [Path, Method, "parameters", "query"]>;

export type ApiBody<
  Path extends ApiPath,
  Method extends HttpMethod
> = GetNestedValue<
  paths,
  [Path, Method, "requestBody", "content", "application/json"]
>;
