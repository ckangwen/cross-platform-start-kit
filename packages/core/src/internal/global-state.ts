import { EventEmitter } from "./EventEmitter";
import { getGlobalThis } from "@workspace/shared";
import type { AxiosAdapter } from "axios";
import { createRequest } from "./axios";

export interface PlatformConfig {
  notification: {
    showToast: (message: string, success: boolean, ...rest: any[]) => void;
    showModal: (message: string, success: boolean, ...rest: any[]) => void;
    showConfirm: (message: string, success: boolean, ...rest: any[]) => void;
  };
  route: {
    navigateTo: (name: string, query?: Record<string, any>, ...rest: any[]) => void;
    replaceTo: (name: string, query?: Record<string, any>, ...rest: any[]) => void;
  };

  axios: {
    adapter: AxiosAdapter;
    baseUrl: string;
    getAuthorization: () => string;
    [k: string]: any;
  };
}

/**
 * 在core层内使用的全局状态存储
 */
class GlobalState {
  public contextName = "default";

  private registeredApi = new Map<keyof PlatformConfig, PlatformConfig[keyof PlatformConfig]>();

  public registerNamespace(name: string) {
    this.contextName = name;
  }

  public registerNotificationConfig = (PlatformConfig: PlatformConfig["notification"]) => {
    this.registeredApi.set(`notification`, PlatformConfig);
  };

  public registerRouteConfig = (PlatformConfig: PlatformConfig["route"]) => {
    this.registeredApi.set(`route`, PlatformConfig);
  };

  public registerAxiosConfig = (PlatformConfig: PlatformConfig["axios"]) => {
    this.registeredApi.set(`axios`, PlatformConfig);
  };

  public events = new EventEmitter();

  public getApi = <T extends keyof PlatformConfig>(type: T) => {
    return this.registeredApi.get(type) as PlatformConfig[T];
  };

  public getRequest = () => {
    const request = createRequest(this.registeredApi.get("axios") as PlatformConfig["axios"]);
    return request;
  };
}

let globalState = new GlobalState();

const GLOBAL_STATE_KEY = "__GLOBAL_STATE__";

if (getGlobalThis()[GLOBAL_STATE_KEY]) {
  globalState = getGlobalThis()[GLOBAL_STATE_KEY];
} else {
  getGlobalThis()[GLOBAL_STATE_KEY] = globalState;
}

export type GlobalStateType = typeof globalState;

export { globalState };
