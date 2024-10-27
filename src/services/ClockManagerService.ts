import type { ApiResponse, QueueResponse } from "@/types/queue.types";
import OfflineQueueService from "./OfflineQueueService";

export interface ClockInResponse {
    clock_period: {
      clockIn: string;  // ou `Date` selon ton formatage
      clockOut?: string;  // Peut être optionnel si le "clock out" n'a pas encore été fait
    };
    message: string;
}

export interface ClockOutResponse {
    clock_period: {
      clockIn: string;  // ou `Date` selon ton formatage
      clockOut?: string;  // Peut être optionnel si le "clock out" n'a pas encore été fait
    };
    message: string;
}

export interface GetAllClocksResponse {
    clocks: {
      clockIn: string;  // ou `Date` selon ton formatage
      clockOut?: string;  // Peut être optionnel si le "clock out" n'a pas encore été fait
    };
    message: string;
}

export class ClockManagerService {
  private queueService: OfflineQueueService;
  private baseUrl: string;

  constructor() {
    this.queueService = new OfflineQueueService();
    this.baseUrl = 'http://134.209.208.89:4000/api';
  }

  async clockIn(userId: number): Promise<ClockInResponse | QueueResponse> {
    try {
      const response = await this.queueService.handleRequest(
        `${this.baseUrl}/clocks/${userId}`,
        'POST',
        null
      );

      if ('queued' in response) {
        return response as QueueResponse;
      }

      if (response && typeof response === 'object') {
        return response as ClockInResponse;
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Error during clock in:', error);
      throw error;
    }
  }

  async clockOut(userId: number): Promise<ClockOutResponse | QueueResponse> {
    try {
      const response = await this.queueService.handleRequest(
        `${this.baseUrl}/clocks/${userId}/out`,
        'POST',
        null
      );

      if ('queued' in response) {
        return response as QueueResponse;
      }

      if (response && typeof response === 'object') {
        return response as ClockOutResponse;
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Error during clock out:', error);
      throw error;
    }
  }

  async getAllClocks(userId: number): Promise<GetAllClocksResponse | QueueResponse> {
    try {
      const response = await this.queueService.handleRequest(
        `${this.baseUrl}/clocks/${userId}`,
        'GET',
        null
      );

      if ('queued' in response) {
        return response as QueueResponse;
      }

      if (response && Array.isArray(response)) {
        return response as unknown as GetAllClocksResponse;
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Error retrieving clocks:', error);
      throw error;
    }
  }
}
