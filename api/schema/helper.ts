import { paths, components } from "./_generated";
import { UnionToIntersection, Get } from "type-fest";

export type schema = components["schemas"];

export type ApiPath = keyof paths;

export type HttpMethod = keyof UnionToIntersection<paths[keyof paths]>;

export type ExactHttpMethodByPath<Path extends ApiPath> = HttpMethod &
  keyof UnionToIntersection<paths[Path]>;

export type ExactPathByHttpMethod<Method extends HttpMethod> =
  Method extends any
    ? keyof {
        [K in keyof paths as paths[K] extends Record<Method, any>
          ? K
          : never]: paths[K];
      }
    : never;
