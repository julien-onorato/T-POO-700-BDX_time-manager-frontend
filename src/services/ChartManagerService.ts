import type { ApiResponse, QueueResponse } from "@/types/queue.types";
import OfflineQueueService from "./OfflineQueueService";

export class ChartManagerService {
    private queueService: OfflineQueueService;
    private baseUrl: string;

    constructor() {
        this.queueService = new OfflineQueueService();
        this.baseUrl = 'http://134.209.208.89:4000/api';
    }

    async getWorkingTimes() {
        try {
            const response = await this.queueService.handleRequest(
              `${this.baseUrl}/workingtime`,
              'GET',
              null
            );

            return response;
          } catch (error) {
            console.error('Error during login:', error);
            throw error;
          }
    }
}

// faire un service pour chaque components avec ses requêtes.