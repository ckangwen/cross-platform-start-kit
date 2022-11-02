import type { PlatformConfig } from "./global-state";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { getGlobalThis, to } from "@workspace/shared";
import { stringify } from "qs";

const qsInterceptor = (axiosConfig: AxiosRequestConfig) => {
  try {
    if (getGlobalThis().FormData && axiosConfig.data instanceof FormData) {
      //
    } else {
      axiosConfig.data = stringify(axiosConfig.data);
    }
  } catch (e) {
    return axiosConfig;
  }
  return axiosConfig;
};

const responseDataInterceptor = (response: AxiosResponse) => {
  return response.data;
};

export const createRequest = (config: PlatformConfig["axios"]) => {
  const authorizationInterceptor = (axiosConfig: AxiosRequestConfig) => {
    if (!axiosConfig.headers?.Authorization) {
      axiosConfig.headers!.Authorization = config.getAuthorization();
    }

    return axiosConfig;
  };

  const service = axios.create({
    baseURL: config.baseUrl,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    timeout: 20000,
  });

  service.interceptors.request.use(authorizationInterceptor);
  service.interceptors.request.use(qsInterceptor);
  service.interceptors.response.use(responseDataInterceptor);

  return (url: string, data: Record<string, any> = {}, method = "POST") => {
    return to(
      service.request({
        method,
        url,
        data,
      }),
    );
  };
};
