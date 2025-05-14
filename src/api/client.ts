import axios, { AxiosError } from "axios";
import { ApiResponse, ApiMethod } from "../types";

/**
 * Client for making requests to the Adamik API
 */
export class AdamikApiClient {
  constructor(private baseUrl: string, private apiKey: string) {}

  /**
   * Make a request to the Adamik API
   */
  async request<T>(
    path: string,
    method: ApiMethod,
    body?: any
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/${path}`;
    const headers = {
      Accept: "application/json",
      Authorization: this.apiKey,
      "Content-Type": "application/json",
      "User-Agent": "Adamik MCP Server",
    };

    try {
      const response = await axios({
        url,
        method,
        headers,
        data: body,
        timeout: 10000, // 10 second timeout
      });

      return {
        data: response.data as T,
        status: response.status,
        success: true,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        return {
          data: null as unknown as T,
          status: error.response?.status || 500,
          success: false,
          error: error.response?.data?.message || error.message,
        };
      }

      return {
        data: null as unknown as T,
        status: 500,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Make a GET request to the Adamik API
   */
  async get<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>(path, "GET");
  }

  /**
   * Make a POST request to the Adamik API
   */
  async post<T>(path: string, body: any): Promise<ApiResponse<T>> {
    return this.request<T>(path, "POST", body);
  }
}
