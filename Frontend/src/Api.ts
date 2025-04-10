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

export interface BoardResponseDTO {
  /** @format guid */
  id?: string;
  /** @format guid */
  userid?: string;
  /** @format guid */
  gameid?: string;
  /** @format decimal */
  price?: number;
  /** @format date */
  dateofpurchase?: string;
  /**
   * @maxItems 8
   * @minItems 5
   */
  numbers?: (number | null)[];
}

export interface PlayBoardDTO {
  /**
   * @format guid
   * @minLength 1
   */
  userid: string;
  /** @format date */
  dateofpurchase?: string;
  /**
   * @maxItems 8
   * @minItems 5
   */
  numbers?: number[];
}

export interface AutoplayBoardDTO {
  /** @format guid */
  id?: string;
  /** @format guid */
  userid?: string;
  /**
   * @maxItems 8
   * @minItems 5
   */
  numbers?: number[];
  /** @format int32 */
  leftToPlay?: number;
}

export interface PlayAutoplayBoardDTO {
  /**
   * @format guid
   * @minLength 1
   */
  userid: string;
  /**
   * @maxItems 8
   * @minItems 5
   */
  numbers?: number[];
  /** @format int32 */
  leftToPlay?: number;
}

export interface BoardGameResponseDTO {
  /** @format guid */
  id?: string;
  user?: string;
  /** @format guid */
  userId?: string;
  /** @format date */
  dateofpurchase?: string;
  /**
   * @maxItems 8
   * @minItems 5
   */
  numbers?: (number | null)[];
}

export interface MyBoards {
  /** @format guid */
  gameId?: string;
  /** @format date */
  startDate?: string;
  status?: GameStatus;
  /** @format date-time */
  endDate?: string | null;
  boards?: UserBoard[];
}

export enum GameStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export interface UserBoard {
  /** @format guid */
  boardId?: string;
  /** @format date */
  dateOfPurchase?: string;
  /**
   * @maxItems 8
   * @minItems 5
   */
  numbers?: (number | null)[];
  /** @format decimal */
  winningAmount?: number;
}

export interface GameResponseDTO {
  /** @format guid */
  id?: string;
  /** @format date */
  date?: string;
  /** @format decimal */
  prize?: number;
  /** @format decimal */
  startingPrizepool?: number;
  winners?: Winner[];
  status?: GameStatus;
  /** @format date-time */
  enddate?: string | null;
  winningNumbers?: number[] | null;
}

export interface Winner {
  /** @format guid */
  id?: string;
  /** @format guid */
  gameid?: string;
  /** @format guid */
  userid?: string;
  /** @format decimal */
  wonamount?: number;
  game?: Game;
  user?: User;
}

export interface Game {
  /** @format guid */
  id?: string;
  /** @format decimal */
  prizepool?: number;
  /** @format date */
  date?: string;
  /** @format decimal */
  startingPrizepool?: number;
  status?: GameStatus;
  /** @format date-time */
  enddate?: string | null;
  boards?: Board[];
  winners?: Winner[];
  winningNumbers?: WinningNumbers[];
}

export interface Board {
  /** @format guid */
  id?: string;
  /** @format guid */
  userid?: string;
  /** @format guid */
  gameid?: string;
  /** @format guid */
  priceid?: string;
  /** @format date */
  dateofpurchase?: string;
  chosennumbers?: Chosennumber[];
  game?: Game;
  price?: Price;
  user?: User;
}

export interface Chosennumber {
  /** @format guid */
  id?: string;
  /** @format guid */
  boardid?: string;
  /** @format int32 */
  number?: number | null;
  board?: Board;
}

export interface Price {
  /** @format guid */
  id?: string;
  /** @format decimal */
  price1?: number;
  /** @format decimal */
  numbers?: number;
  boards?: Board[];
}

export interface User {
  /** @format guid */
  id?: string;
  name?: string;
  email?: string;
  phonenumber?: string;
  passwordhash?: string;
  enrolled?: UserEnrolled;
  /** @format decimal */
  balance?: number;
  role?: UserRole;
  status?: UserStatus;
  boards?: Board[];
  boardAutoplays?: BoardAutoplay[];
  transactions?: Transaction[];
  winners?: Winner[];
}

export enum UserEnrolled {
  True = "True",
  False = "False",
}

export enum UserRole {
  User = "User",
  Admin = "Admin",
}

export enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
}

export interface BoardAutoplay {
  /** @format guid */
  id?: string;
  /** @format guid */
  userId?: string;
  /** @format int32 */
  leftToPlay?: number;
  user?: User;
  chosenNumbersAutoplays?: ChosenNumbersAutoplay[];
}

export interface ChosenNumbersAutoplay {
  /** @format guid */
  id?: string;
  /** @format guid */
  boardId?: string;
  /** @format int32 */
  number?: number;
  boardAutoplay?: BoardAutoplay;
}

export interface Transaction {
  /** @format guid */
  id?: string;
  /** @format guid */
  userid?: string;
  transactionnumber?: string;
  transactionstatus?: TransactionStatusA;
  user?: User;
}

export enum TransactionStatusA {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
}

export interface WinningNumbers {
  /** @format guid */
  id?: string;
  /** @format guid */
  gameId?: string;
  /** @format int32 */
  number?: number;
  game?: Game;
}

export interface WinningNumbersResponseDTO {
  /** @format guid */
  gameid?: string;
  /**
   * @maxItems 3
   * @minItems 3
   */
  winningnumbers?: number[];
  status?: GameStatus;
}

export interface WinningNumbersRequestDTO {
  /**
   * @format guid
   * @minLength 1
   */
  gameId: string;
  /**
   * @maxItems 3
   * @minItems 3
   */
  winningNumbers: number[];
}

export interface PriceDto {
  /** @format decimal */
  price1?: number;
  /** @format decimal */
  numbers?: number;
}

export interface TransactionResponseDTO {
  /** @format guid */
  id?: string;
  /** @format guid */
  userId?: string;
  phoneNumber?: string;
  username?: string;
  transactionNumber?: string;
  transactionStatus?: TransactionStatusA;
}

export interface DepositRequestDTO {
  /**
   * @minLength 8
   * @maxLength 15
   */
  transactionNumber: string;
}

export interface BalanceAdjustmentRequestDTO {
  /** @minLength 1 */
  transactionId: string;
  /**
   * @format decimal
   * @min 0
   * @max 10000
   */
  amount: number;
  adjustment: TransactionAdjustment;
  transactionStatusA: TransactionStatusA;
}

export enum TransactionAdjustment {
  Deposit = "Deposit",
  Deduct = "Deduct",
}

export interface AuthorizedUserResponseDTO {
  /** @format guid */
  id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  /** @format decimal */
  balance?: number;
  role?: UserRole;
  enrolled?: UserEnrolled;
  status?: UserStatus;
}

export interface UserResponseDTO {
  /** @minLength 1 */
  id: string;
  /** @minLength 1 */
  jwt: string;
}

export interface UserLoginRequestDTO {
  /**
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * @minLength 5
   * @maxLength 32
   */
  password: string;
}

export interface UserEnrollmentRequestDTO {
  /**
   * @minLength 5
   * @maxLength 32
   */
  password: string;
}

export interface UserUpdateRequestDTO {
  name?: string | null;
  /** @format email */
  email?: string | null;
  /**
   * @format phone
   * @minLength 8
   * @maxLength 8
   */
  phoneNumber?: string | null;
  /**
   * @minLength 5
   * @maxLength 32
   */
  password?: string | null;
}

export interface UserSignupRequestDTO {
  /** @minLength 1 */
  name: string;
  /**
   * @format email
   * @minLength 1
   */
  email: string;
  /**
   * @format phone
   * @minLength 8
   * @maxLength 8
   */
  phoneNumber: string;
}

export interface UserUpdateByAdminRequestDTO {
  /**
   * @format guid
   * @minLength 1
   */
  id: string;
  name?: string | null;
  /** @format email */
  email?: string | null;
  /**
   * @format phone
   * @minLength 8
   * @maxLength 8
   */
  phoneNumber?: string | null;
  /**
   * @minLength 5
   * @maxLength 32
   */
  password?: string | null;
  enrolledStatus?: UserEnrolled | null;
  userStatus?: UserStatus | null;
  userRole?: UserRole | null;
}

export interface WinnersDto {
  /** @format guid */
  gameid?: string;
  name?: string;
  /** @format guid */
  userId?: string;
  /** @format decimal */
  prize?: number;
  /** @format int32 */
  numberOfWinningBoards?: number;
  winningBoards?: BoardGameResponseDTO[];
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
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

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
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

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:5001" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
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
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
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

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
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
 * @title My Title
 * @version 1.0.0
 * @baseUrl http://localhost:5001
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  board = {
    /**
     * No description
     *
     * @tags Board
     * @name BoardPlayBoard
     * @request POST:/Board/Play
     */
    boardPlayBoard: (data: PlayBoardDTO, params: RequestParams = {}) =>
      this.request<BoardResponseDTO, any>({
        path: `/Board/Play`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardAutoplayBoard
     * @request POST:/Board/Autoplay
     */
    boardAutoplayBoard: (data: PlayAutoplayBoardDTO, params: RequestParams = {}) =>
      this.request<AutoplayBoardDTO, any>({
        path: `/Board/Autoplay`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardGetAllBoards
     * @request GET:/Board/GetBoards
     */
    boardGetAllBoards: (params: RequestParams = {}) =>
      this.request<BoardResponseDTO[], any>({
        path: `/Board/GetBoards`,
        method: "GET",
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardGetBoardsFromGame
     * @request GET:/Board/GetBoardsFromGame/{gameId}
     */
    boardGetBoardsFromGame: (gameId: string, params: RequestParams = {}) =>
      this.request<BoardGameResponseDTO[], any>({
        path: `/Board/GetBoardsFromGame/${gameId}`,
        method: "GET",
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardGetAutoplayBoards
     * @request GET:/Board/GetAutoplayBoards/{userId}
     */
    boardGetAutoplayBoards: (userId: string, params: RequestParams = {}) =>
      this.request<AutoplayBoardDTO[], any>({
        path: `/Board/GetAutoplayBoards/${userId}`,
        method: "GET",
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Board
     * @name BoardUserBoardHistory
     * @request GET:/Board/@me/History
     */
    boardUserBoardHistory: (params: RequestParams = {}) =>
      this.request<MyBoards[], any>({
        path: `/Board/@me/History`,
        method: "GET",
        format: "json",
        withCredentials: true,
        ...params,
      }),
  };
  game = {
    /**
     * No description
     *
     * @tags Game
     * @name GameGetAllGames
     * @request GET:/Game/getAllGames
     */
    gameGetAllGames: (params: RequestParams = {}) =>
      this.request<GameResponseDTO[], any>({
        path: `/Game/getAllGames`,
        method: "GET",
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Game
     * @name GameSetWinningNumbers
     * @request POST:/Game/winningNumbers
     */
    gameSetWinningNumbers: (data: WinningNumbersRequestDTO, params: RequestParams = {}) =>
      this.request<WinningNumbersResponseDTO, any>({
        path: `/Game/winningNumbers`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        withCredentials: true,
        ...params,
      }),
  };
  price = {
    /**
     * No description
     *
     * @tags Price
     * @name PriceGetPrices
     * @request GET:/Price/GetPrices
     */
    priceGetPrices: (params: RequestParams = {}) =>
      this.request<PriceDto[], any>({
        path: `/Price/GetPrices`,
        method: "GET",
        format: "json",
        withCredentials: true,
        ...params,
      }),
  };
  transaction = {
    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionPUserDepositReq
     * @request POST:/Transaction/@user/balance/deposit
     */
    transactionPUserDepositReq: (data: DepositRequestDTO, params: RequestParams = {}) =>
      this.request<TransactionResponseDTO, any>({
        path: `/Transaction/@user/balance/deposit`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionPUserTransactionsReqs
     * @request GET:/Transaction/@user/balance/history
     */
    transactionPUserTransactionsReqs: (params: RequestParams = {}) =>
      this.request<TransactionResponseDTO[], any>({
        path: `/Transaction/@user/balance/history`,
        method: "GET",
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionPUseBalance
     * @request PATCH:/Transaction/@admin/balance/adjustment
     */
    transactionPUseBalance: (data: BalanceAdjustmentRequestDTO, params: RequestParams = {}) =>
      this.request<boolean, any>({
        path: `/Transaction/@admin/balance/adjustment`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Transaction
     * @name TransactionPDepositReqs
     * @request GET:/Transaction/@admin/balance/history
     */
    transactionPDepositReqs: (params: RequestParams = {}) =>
      this.request<TransactionResponseDTO[], any>({
        path: `/Transaction/@admin/balance/history`,
        method: "GET",
        format: "json",
        withCredentials: true,
        ...params,
      }),
  };
  user = {
    /**
     * No description
     *
     * @tags User
     * @name UserGGetUser
     * @request GET:/User/@user
     */
    userGGetUser: (params: RequestParams = {}) =>
      this.request<AuthorizedUserResponseDTO, any>({
        path: `/User/@user`,
        method: "GET",
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserPLogin
     * @request POST:/User/@user/login
     */
    userPLogin: (data: UserLoginRequestDTO, params: RequestParams = {}) =>
      this.request<UserResponseDTO, any>({
        path: `/User/@user/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserPEnroll
     * @request PATCH:/User/@user/enroll
     */
    userPEnroll: (data: UserEnrollmentRequestDTO, params: RequestParams = {}) =>
      this.request<AuthorizedUserResponseDTO, any>({
        path: `/User/@user/enroll`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserPUpdateUser
     * @request PATCH:/User/@user/update
     */
    userPUpdateUser: (data: UserUpdateRequestDTO, params: RequestParams = {}) =>
      this.request<AuthorizedUserResponseDTO, any>({
        path: `/User/@user/update`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserPSignup
     * @request POST:/User/@admin/signup
     */
    userPSignup: (data: UserSignupRequestDTO, params: RequestParams = {}) =>
      this.request<AuthorizedUserResponseDTO, any>({
        path: `/User/@admin/signup`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserGGetUsers
     * @request GET:/User/@admin/users
     */
    userGGetUsers: (params: RequestParams = {}) =>
      this.request<AuthorizedUserResponseDTO[], any>({
        path: `/User/@admin/users`,
        method: "GET",
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags User
     * @name UserPUpdateUserByAdmin
     * @request PATCH:/User/@admin/user
     */
    userPUpdateUserByAdmin: (data: UserUpdateByAdminRequestDTO, params: RequestParams = {}) =>
      this.request<AuthorizedUserResponseDTO, any>({
        path: `/User/@admin/user`,
        method: "PATCH",
        body: data,
        type: ContentType.Json,
        format: "json",
        withCredentials: true,
        ...params,
      }),
  };
  winners = {
    /**
     * No description
     *
     * @tags Winners
     * @name WinnersEstablishWinners
     * @request GET:/Winners/establishWinners/{gameId}
     */
    winnersEstablishWinners: (gameId: string, params: RequestParams = {}) =>
      this.request<WinnersDto[], any>({
        path: `/Winners/establishWinners/${gameId}`,
        method: "GET",
        format: "json",
        withCredentials: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Winners
     * @name WinnersGetWinners
     * @request GET:/Winners/getWinners/{gameId}
     */
    winnersGetWinners: (gameId: string, params: RequestParams = {}) =>
      this.request<WinnersDto[], any>({
        path: `/Winners/getWinners/${gameId}`,
        method: "GET",
        format: "json",
        withCredentials: true,
        ...params,
      }),
  };
}