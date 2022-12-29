/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface AddionalResponse {
  id: number;
  user: {
    id: number;
    name: string;
  };
}

export interface NullResponse {
  id: number;
  user: {
    id: number;
    name: string;
  } | null;
  userNull: {
    id: number;
    name: string;
  } | null;
}

export interface ObjectResponse {
  id: number;
  anyRecord: Record<string, any>;
  anyObject: Record<string, string>;
  stringObject: Record<string, string>;
}

export interface AnyResponse {
  id: number;
  anyString: any;
  anyArray: any[];
  anyObject: any;
  multiNull: number | string | null;
  multiNumber: number | string | null;
  multiString: number | string | null;
}

export interface UndefinedResponse {
  id: number;
  string?: string;
  stringUndefined?: string;
  object?: {
    id: number;
    name: string;
  };
  objectUndefined?: {
    id: number;
    name: string;
  };
  objectNull?: {
    id: number;
    name: string;
  } | null;
  objectNullUndefined?: {
    id: number;
    name: string;
  } | null;
  objectNullUndefined2?: {
    id: number;
    name: string;
  } | null;
}

export type EmptyInterfaceResponse = object;

export interface NestedInterfaceResponse {
  ids: {
    id: number;
  }[];
}

export interface NullConvertResponse {
  id: string;
}

export interface ListTodoQuery {
  includeDone?: boolean;
}

export interface TodoResponse {
  id: number;
  /** @format date-time */
  createdAt: string;
  text: string;
  priority: number;
  done: boolean;
}

export interface CreateTodo {
  text: string;
  priority: number;
}

export interface UpdateTodo {
  /** @format date-time */
  createdAt?: string;
  text?: string;
  priority?: number;
  done?: boolean;
}

export type InputEmptyQuery = object;

export interface InputEmptyStringNull {
  n: number | null;
  n2?: number | null;
}

import axios, { AxiosInstance, AxiosRequestConfig, ResponseType } from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private format?: ResponseType;

  constructor({ format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });
    this.format = format;
  }

  public request = async <T = any, _E = any>({
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const requestParams = params;
    const responseFormat = (format && this.format) || void 0;

    if (!type) {
      type = ContentType.Json;
    }

    if (!body) {
      body = {};
    }

    try {
      const result: any = await this.instance.request({
        ...requestParams,
        headers: {
          ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
          ...(requestParams.headers || {}),
        } as any,
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      });

      return result.data;
    } catch (err: any) /* istanbul ignore next */ {
      if (axios.isAxiosError(err) && err.config) {
        err.message += ` [${err.config.method}] ${err.config.url}`;
        if (err.response) {
          (err as any).data = err.response.data;
        }
      }

      throw err;
    }
  };
}

/**
 * @title Api
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  responses = {
    /**
     * No description
     *
     * @tags responses
     * @name VoidResponse
     * @request DELETE:/responses/void
     */
    voidResponse: (params: RequestParams = {}) =>
      this.request<EmptyInterfaceResponse, any>({
        path: `/responses/void`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags responses
     * @name String
     * @request GET:/responses/string
     */
    string: (params: RequestParams = {}) =>
      this.request<string, any>({
        path: `/responses/string`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags responses
     * @name Number
     * @request GET:/responses/number
     */
    number: (params: RequestParams = {}) =>
      this.request<number, any>({
        path: `/responses/number`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags responses
     * @name Any
     * @request GET:/responses/any
     */
    any: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/responses/any`,
        method: 'GET',
        ...params,
      }),

    /**
     * No description
     *
     * @tags responses
     * @name RemoveAdditional
     * @request GET:/responses/remove-additional
     */
    removeAdditional: (params: RequestParams = {}) =>
      this.request<
        {
          id: number;
          user: {
            id: number;
            name: string;
          };
        },
        any
      >({
        path: `/responses/remove-additional`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags responses
     * @name NullProperty
     * @request GET:/responses/null-property
     */
    nullProperty: (params: RequestParams = {}) =>
      this.request<
        {
          id: number;
          user: {
            id: number;
            name: string;
          } | null;
          userNull: {
            id: number;
            name: string;
          } | null;
        },
        any
      >({
        path: `/responses/null-property`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags responses
     * @name ObjectResponse
     * @request GET:/responses/object-response
     */
    objectResponse: (params: RequestParams = {}) =>
      this.request<
        {
          id: number;
          anyRecord: Record<string, any>;
          anyObject: Record<string, string>;
          stringObject: Record<string, string>;
        },
        any
      >({
        path: `/responses/object-response`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags responses
     * @name AnyResponse
     * @request GET:/responses/any-response
     */
    anyResponse: (params: RequestParams = {}) =>
      this.request<
        {
          id: number;
          anyString: any;
          anyArray: any[];
          anyObject: any;
          multiNull: number | string | null;
          multiNumber: number | string | null;
          multiString: number | string | null;
        },
        any
      >({
        path: `/responses/any-response`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags responses
     * @name UndefinedResponse
     * @request GET:/responses/undefined-response
     */
    undefinedResponse: (params: RequestParams = {}) =>
      this.request<
        {
          id: number;
          string?: string;
          stringUndefined?: string;
          object?: {
            id: number;
            name: string;
          };
          objectUndefined?: {
            id: number;
            name: string;
          };
          objectNull?: {
            id: number;
            name: string;
          } | null;
          objectNullUndefined?: {
            id: number;
            name: string;
          } | null;
          objectNullUndefined2?: {
            id: number;
            name: string;
          } | null;
        },
        any
      >({
        path: `/responses/undefined-response`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags responses
     * @name EmptyInterfaceResponse
     * @request GET:/responses/empty-interface-response
     */
    emptyInterfaceResponse: (params: RequestParams = {}) =>
      this.request<EmptyInterfaceResponse, any>({
        path: `/responses/empty-interface-response`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags responses
     * @name NestedInterfaceResponse
     * @request GET:/responses/nested-interface-response
     */
    nestedInterfaceResponse: (params: RequestParams = {}) =>
      this.request<
        {
          ids: {
            id: number;
          }[];
        },
        any
      >({
        path: `/responses/nested-interface-response`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags responses
     * @name NullConvertResponse
     * @request GET:/responses/null-convert-response
     */
    nullConvertResponse: (params: RequestParams = {}) =>
      this.request<
        {
          id: string;
        },
        any
      >({
        path: `/responses/null-convert-response`,
        method: 'GET',
        format: 'json',
        ...params,
      }),
  };
  todos = {
    /**
     * No description
     *
     * @tags todos
     * @name List
     * @request GET:/todos
     */
    list: (
      query?: {
        includeDone?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: number;
          /** @format date-time */
          createdAt: string;
          text: string;
          priority: number;
          done: boolean;
        }[],
        any
      >({
        path: `/todos`,
        method: 'GET',
        query: query,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags todos
     * @name Create
     * @request POST:/todos
     */
    create: (
      data: {
        text: string;
        priority: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: number;
          /** @format date-time */
          createdAt: string;
          text: string;
          priority: number;
          done: boolean;
        },
        any
      >({
        path: `/todos`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags todos
     * @name Get
     * @request GET:/todos/{id}
     */
    get: (id: number, params: RequestParams = {}) =>
      this.request<
        {
          id: number;
          /** @format date-time */
          createdAt: string;
          text: string;
          priority: number;
          done: boolean;
        },
        any
      >({
        path: `/todos/${id}`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags todos
     * @name Update
     * @request POST:/todos/{id}
     */
    update: (
      id: number,
      data: {
        /** @format date-time */
        createdAt?: string;
        text?: string;
        priority?: number;
        done?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          id: number;
          /** @format date-time */
          createdAt: string;
          text: string;
          priority: number;
          done: boolean;
        },
        any
      >({
        path: `/todos/${id}`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags todos
     * @name Remove
     * @request DELETE:/todos/{id}
     */
    remove: (id: number, params: RequestParams = {}) =>
      this.request<EmptyInterfaceResponse, any>({
        path: `/todos/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),
  };
  inputs = {
    /**
     * No description
     *
     * @tags input
     * @name EmptyQuery
     * @request GET:/inputs/empty-query
     */
    emptyQuery: (params: RequestParams = {}) =>
      this.request<EmptyInterfaceResponse, any>({
        path: `/inputs/empty-query`,
        method: 'GET',
        format: 'json',
        ...params,
      }),

    /**
     * No description
     *
     * @tags input
     * @name EmptyStringNull
     * @request GET:/inputs/empty-string-null
     */
    emptyStringNull: (
      query: {
        n: number | null;
        n2?: number | null;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, any>({
        path: `/inputs/empty-string-null`,
        method: 'GET',
        query: query,
        ...params,
      }),
  };
}
