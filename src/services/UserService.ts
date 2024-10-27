import type { ApiResponse, QueueResponse } from "@/types/queue.types";
import OfflineQueueService from "./OfflineQueueService";

export interface UserData {
    name: string;
    email: string;
    [key: string]: any; // For additional user properties
  }
  
  export class UserService {
    private queueService: OfflineQueueService;
    private baseUrl: string;
  
    constructor() {
      this.queueService = new OfflineQueueService();
      this.baseUrl = 'http://134.209.208.89:4000/api/';
    }
  
    async updateUser(userId: string, userData: UserData): Promise<ApiResponse | QueueResponse> {
      try {
        return await this.queueService.handleRequest(
          `${this.baseUrl}/users/${userId}`,
          'PUT',
          userData
        );
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    }
  }