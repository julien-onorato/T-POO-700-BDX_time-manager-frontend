import type { ApiResponse, QueueResponse } from "@/types/queue.types";
import OfflineQueueService from "./OfflineQueueService";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface PasswordChangeCredentials {
  oldPassword: string;
  newPassword: string;
}

export interface AuthResponse {
    user_id: number;
}

export class AuthService {
  private queueService: OfflineQueueService;
  private baseUrl: string;

  constructor() {
    this.queueService = new OfflineQueueService();
    this.baseUrl = 'http://134.209.208.89:4000/api';
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse | QueueResponse> {
    try {
      const response = await this.queueService.handleRequest(
        `${this.baseUrl}/auth/login`,
        'POST',
        credentials
      );
      
      if ('queued' in response) {
        return response as QueueResponse;
      }
      
      if ('user_id' in response && typeof response.user_id === 'number') {
        return { user_id: response.user_id };
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse | QueueResponse> {
    try {
      const response = await this.queueService.handleRequest(
        `${this.baseUrl}/auth/register`,
        'POST',
        credentials
      );
      
      if ('queued' in response) {
        return response as QueueResponse;
      }

      
      if ('user_id' in response && typeof response.user_id === 'number') {
        return { user_id: response.user_id };
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  async submitPasswordChange(credentials: PasswordChangeCredentials, userId: number): Promise<AuthResponse | QueueResponse> {
    try {
      const response = await this.queueService.handleRequest(
        `${this.baseUrl}/users/56/password`,
        'POST',
        credentials
      );
      
      if ('queued' in response) {
        return response as QueueResponse;
      }

      
      if ('user_id' in response && typeof response.user_id === 'number') {
        return { user_id: response.user_id };
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }
}