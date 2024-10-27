import type { QueuedRequest, ApiResponse, QueueResponse } from "@/types/queue.types";

export default class OfflineQueueService {
    private isOnline: boolean;
    private readonly queueKey: string;
    
    constructor() {
      this.isOnline = navigator.onLine;
      this.queueKey = 'offlineRequestsQueue';
      
      window.addEventListener('online', () => this.handleConnectionChange(true));
      window.addEventListener('offline', () => this.handleConnectionChange(false));
    }
  
    private async handleConnectionChange(isOnline: boolean): Promise<void> {
      this.isOnline = isOnline;
      if (isOnline) {
        await this.processQueue();
      }
    }
  
    private async addToQueue(request: Omit<QueuedRequest, 'timestamp'>): Promise<void> {
      const queue = this.getQueue();
      queue.push({
        ...request,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(this.queueKey, JSON.stringify(queue));
    }
  
    private getQueue(): QueuedRequest[] {
      const queue = localStorage.getItem(this.queueKey);
      return queue ? JSON.parse(queue) : [];
    }
  
    private async processQueue(): Promise<void> {
      const queue = this.getQueue();
      if (queue.length === 0) return;
  
      for (const request of queue) {
        try {
          await this.makeRequest(request);
          this.removeFromQueue(request.timestamp);
        } catch (error) {
          console.error('Error processing queued request:', error);
          break;
        }
      }
    }
  
    private removeFromQueue(timestamp: string): void {
      const queue = this.getQueue();
      const updatedQueue = queue.filter(req => req.timestamp !== timestamp);
      localStorage.setItem(this.queueKey, JSON.stringify(updatedQueue));
    }
  
    private async makeRequest({ url, method, data }: Omit<QueuedRequest, 'timestamp'>): Promise<ApiResponse> {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    }
  
    public async handleRequest(
      url: string,
      method: QueuedRequest['method'],
      data: any
    ): Promise<ApiResponse | QueueResponse> {
      if (this.isOnline) {
        try {
          return await this.makeRequest({ url, method, data });
        } catch (error) {
          console.error('Error making request:', error);
          throw error;
        }
      }
      
      await this.addToQueue({ url, method, data });
      return {
        queued: true,
        message: 'Request queued for later processing'
      };
    }
  }