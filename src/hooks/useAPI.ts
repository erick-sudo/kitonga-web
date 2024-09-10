import { AxiosError, AxiosResponse } from "axios";

// Types for the parameters
interface HandleRequestParams<T> {
  func: (...args: any[]) => Promise<AxiosResponse<T>>;
  args?: any[];
  headers?: Record<string, string>;
  successCallback?: (response: AxiosResponse<T>) => void;
  errorCallback?: (error: AxiosError) => void;
}

export interface RequestMessages {
  message: string;
  statusText: string;
}

export interface RequestSuccess<T> extends RequestMessages {
  status: "ok";
  result: T;
  errors?: undefined;
}

export interface RequestError extends RequestMessages {
  status: string;
  errors: any;
  result?: undefined;
}

// Combine success and error result types
export type RequestResult<T> = RequestSuccess<T> | RequestError;

export default function useAPI() {
  const handleRequest = async <T>({
    func,
    args = [],
    headers = {},
    successCallback,
    errorCallback,
  }: HandleRequestParams<T>): Promise<RequestResult<T>> => {
    try {
      const response = await func(
        ...[
          args,
          {
            headers,
          },
        ].flat()
      );

      if (typeof successCallback === "function") {
        successCallback(response);
      }

      return {
        status: "ok",
        result: response.data,
        statusText: "SUCCESS",
        message: "Success",
      };
    } catch (error) {
      if (typeof errorCallback === "function") {
        errorCallback(error as AxiosError);
      }

      const axiosError = error as AxiosError;
      if (axiosError.response?.status) {
        const statusCode = axiosError.response.status;
        return {
          status: `${statusCode}`,
          message: axiosError.message,
          statusText: axiosError.response.statusText,
          errors: axiosError.response.data,
        };
      } else {
        return {
          statusText: "unexpected",
          status: "error",
          errors: axiosError.message,
          message: axiosError.message,
        };
      }
    }
  };

  return handleRequest;
}
