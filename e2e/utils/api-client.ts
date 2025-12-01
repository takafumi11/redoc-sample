import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';

export interface WithdrawRequest {
  amount?: number | string;
}

export interface WithdrawResponse {
  accountId: string;
  withdrawnAmount: number;
  balance: number;
}

export interface ErrorResponse {
  errorCode: string;
  message: string;
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: () => true, // Don't throw on non-2xx status
    });
  }

  async withdraw(
    accountId: string,
    body: WithdrawRequest | Record<string, unknown>
  ): Promise<AxiosResponse<WithdrawResponse | ErrorResponse>> {
    return this.client.post(`/accounts/${accountId}/withdraw`, body);
  }
}

export const apiClient = new ApiClient();
