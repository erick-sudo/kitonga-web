import { AxiosError, AxiosResponse } from "axios";

// Types for the parameters
interface HandleRequestParams<T> {
  func: (...args: any[]) => Promise<AxiosResponse<T>>;
  args?: any[];
  headers?: Record<string, string>;
  successCallback?: (response: AxiosResponse<T>) => void;
  errorCallback?: (error: AxiosError) => void;
}

// Types for the result of the request
interface RequestSuccess<T> {
  status: "ok";
  result?: T;
}

interface RequestError {
  status: string;
  result: null;
  message: string;
  statusText?: string;
  errors?: any;
}

// Combine success and error result types
type RequestResult<T> = RequestSuccess<T> | RequestError;

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
          result: null,
          message: axiosError.message,
          statusText: axiosError.response.statusText,
          errors: axiosError.response.data,
        };
      } else {
        return {
          status: "error",
          result: null,
          message: axiosError.message,
        };
      }
    }
  };

  return handleRequest;
}
