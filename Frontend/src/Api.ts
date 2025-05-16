/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** @format int32 */
export enum UserRole {
  Value0 = 0,
  Value1 = 1,
}

export interface AuthorizedUserResponseDto {
  /** @format uuid */
  id?: string;
  name?: string | null;
  role?: UserRole;
}

export interface Device {
  /** @format uuid */
  id?: string;
  /** @format uuid */
  userId?: string;
  deviceName?: string | null;
}

export interface DeviceAssignDto {
  /** @format uuid */
  deviceId?: string;
  deviceName?: string | null;
}

export interface SubscirbeToTopicDto {
  topicNames: string[];
  /** @format int32 */
  userId: number;
}

export interface UserLoginDto {
  /** @minLength 1 */
  name: string;
  /** @minLength 5 */
  password: string;
}

export interface UserLoginResponseDto {
  id?: string | null;
  jwtToken?: string | null;
}

export interface UserSignupDto {
  /** @minLength 1 */
  name: string;
  /** @minLength 5 */
  password: string;
}

export interface UserSignupResponseDto {
  id?: string | null;
  jwtToken?: string | null;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
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

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || import.meta.env.VITE_API_URI,
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

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
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Greenhouse.API
 * @version 1.0
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  auth = {
    /**
     * No description
     *
     * @tags Auth
     * @name UserList
     * @request GET:/Auth/@user
     */
    userList: (params: RequestParams = {}) =>
      this.request<AuthorizedUserResponseDto, any>({
        path: `/Auth/@user`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name UserLoginCreate
     * @request POST:/Auth/@user/login
     */
    userLoginCreate: (data: UserLoginDto, params: RequestParams = {}) =>
      this.request<UserLoginResponseDto, any>({
        path: `/Auth/@user/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Auth
     * @name UserSignupCreate
     * @request POST:/Auth/@user/signup
     */
    userSignupCreate: (data: UserSignupDto, params: RequestParams = {}) =>
      this.request<UserSignupResponseDto, any>({
        path: `/Auth/@user/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  device = {
    /**
     * No description
     *
     * @tags Device
     * @name AssignDeviceToUserCreate
     * @request POST:/Device/AssignDeviceToUser
     */
    assignDeviceToUserCreate: (
      data: DeviceAssignDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/Device/AssignDeviceToUser`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Device
     * @name MyDevicesList
     * @request GET:/Device/MyDevices
     */
    myDevicesList: (params: RequestParams = {}) =>
      this.request<Device[], any>({
        path: `/Device/MyDevices`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
  hello = {
    /**
     * No description
     *
     * @tags Hello
     * @name HelloWorldList
     * @request GET:/Hello/HelloWorld
     */
    helloWorldList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Hello/HelloWorld`,
        method: "GET",
        ...params,
      }),
  };
  subscription = {
    /**
     * No description
     *
     * @tags Subscription
     * @name SubscribeYourDevicesCreate
     * @request POST:/Subscription/Subscribe/YourDevices
     */
    subscribeYourDevicesCreate: (data: string, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/Subscription/Subscribe/YourDevices`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Subscription
     * @name SubscribeSpecificTopicsCreate
     * @request POST:/Subscription/Subscribe/SpecificTopics
     */
    subscribeSpecificTopicsCreate: (
      data: SubscirbeToTopicDto,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/Subscription/Subscribe/SpecificTopics`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),
  };
}
