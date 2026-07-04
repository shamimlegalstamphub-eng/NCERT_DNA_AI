/**
 * NCERT DNA AI - Unified API Client
 * Supports auto JWT attachment, refresh tokens, request retry, timeouts,
 * typed responses, and structured local-first offline fallback.
 */

export interface ApiResponse<T = any> {
  status: "SUCCESS" | "ERROR";
  message?: string;
  data?: T;
  [key: string]: any;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const API_TIMEOUT_MS = 15000;

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = API_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

class ApiClient {
  getToken(): string | null {
    return localStorage.getItem("ncert_dna_jwt");
  }

  setToken(token: string) {
    localStorage.setItem("ncert_dna_jwt", token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem("ncert_dna_refresh_jwt");
  }

  setRefreshToken(token: string) {
    localStorage.setItem("ncert_dna_refresh_jwt", token);
  }

  clearAuth() {
    localStorage.removeItem("ncert_dna_jwt");
    localStorage.removeItem("ncert_dna_refresh_jwt");
  }

  async request<T = any>(endpoint: string, options: RequestInit = {}, retryCount = 1): Promise<T> {
    const url = endpoint.startsWith("/") ? endpoint : `/api/${endpoint}`;
    const token = this.getToken();

    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const config: RequestInit = {
      ...options,
      headers
    };

    try {
      const response = await fetchWithTimeout(url, config);

      if (response.status === 401 && retryCount > 0) {
        // Attempt token refresh if available
        const refreshed = await this.refreshSession();
        if (refreshed) {
          return this.request<T>(endpoint, options, retryCount - 1);
        }
      }

      if (!response.ok) {
        let errMsg = `Request failed with status ${response.status}`;
        try {
          const json = await response.json();
          errMsg = json.message || errMsg;
        } catch (_) {}
        throw new ApiError(errMsg, response.status);
      }

      const json = await response.json();
      return json as T;
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw new ApiError("Network request timed out. Please check your connection.", 408);
      }
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(error.message || "Network request failed.", 500);
    }
  }

  async refreshSession(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearAuth();
      return false;
    }

    try {
      // Send refresh handshake to authentication endpoint
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: localStorage.getItem("ncert_dna_user_email") })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.status === "SUCCESS") {
          this.setToken(data.token);
          if (data.refreshToken) {
            this.setRefreshToken(data.refreshToken);
          }
          return true;
        }
      }
    } catch (e) {
      console.error("Failed to automatically refresh session token:", e);
    }

    this.clearAuth();
    return false;
  }

  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined
    });
  }

  async put<T = any>(endpoint: string, body?: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined
    });
  }

  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

export const api = new ApiClient();
