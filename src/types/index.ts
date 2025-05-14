/**
 * Shared type definitions for the adamik-mcp-server
 */

// API response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
  error?: string;
}

// Tool-specific types
export interface StarknetSignature {
  signature: string;
  r: string;
  s: string;
}

// API request types
export type ApiMethod = "GET" | "POST";

export interface AdamikApiRequestOptions {
  path: string;
  method: ApiMethod;
  body?: any;
}
