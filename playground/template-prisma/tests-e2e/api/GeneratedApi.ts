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

export interface TodoResponse {
  id: number;
  /** @format date-time */
  createdAt: string;
  text: string;
  priority: number;
  done: boolean;
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

    if (!body) {
      body = {};
    }

    try {
      const result: any = await this.instance.request({
        ...requestParams,
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
     * @request PUT:/todos/{id}
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
        method: 'PUT',
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
      this.request<any, any>({
        path: `/todos/${id}`,
        method: 'DELETE',
        format: 'json',
        ...params,
      }),
  };
}
