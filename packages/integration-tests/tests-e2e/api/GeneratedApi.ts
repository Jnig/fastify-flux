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
  user: { id: number; name: string };
}

export interface NullResponse {
  id: number;
  user: { id: number; name: string };
  userNull: { id: number; name: string };
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
  object?: { id: number; name: string };
  objectUndefined?: { id: number; name: string };
  objectNull?: { id: number; name: string };
  objectNullUndefined?: { id: number; name: string };
  objectNullUndefined2?: { id: number; name: string };
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
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || '' });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  private mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  private createFormData(input: Record<string, unknown>): FormData {
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      formData.append(
        key,
        property instanceof Blob
          ? property
          : typeof property === 'object' && property !== null
          ? JSON.stringify(property)
          : `${property}`,
      );
      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = (format && this.format) || void 0;

    if (type === ContentType.FormData && body && body !== null && typeof body === 'object') {
      body = this.createFormData(body as Record<string, unknown>);
    }

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
        },
        params: query,
        responseType: responseFormat,
        data: body,
        url: path,
      });

      return result.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
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
      this.request<object, any>({
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
      this.request<{ id: number; user: { id: number; name: string } }, any>({
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
      this.request<{ id: number; user: { id: number; name: string }; userNull: { id: number; name: string } }, any>({
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
          object?: { id: number; name: string };
          objectUndefined?: { id: number; name: string };
          objectNull?: { id: number; name: string };
          objectNullUndefined?: { id: number; name: string };
          objectNullUndefined2?: { id: number; name: string };
        },
        any
      >({
        path: `/responses/undefined-response`,
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
    list: (query?: { includeDone?: boolean }, params: RequestParams = {}) =>
      this.request<{ id: number; createdAt: string; text: string; priority: number; done: boolean }[], any>({
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
    create: (data: { text: string; priority: number }, params: RequestParams = {}) =>
      this.request<{ id: number; createdAt: string; text: string; priority: number; done: boolean }, any>({
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
      this.request<{ id: number; createdAt: string; text: string; priority: number; done: boolean }, any>({
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
      data: { createdAt?: string; text?: string; priority?: number; done?: boolean },
      params: RequestParams = {},
    ) =>
      this.request<{ id: number; createdAt: string; text: string; priority: number; done: boolean }, any>({
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
      this.request<object, any>({
        path: `/todos/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),
  };
}
