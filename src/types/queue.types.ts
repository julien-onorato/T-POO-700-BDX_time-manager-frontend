export interface QueuedRequest {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data: any;
    timestamp: string;
}
  
export interface QueueResponse {
    queued: boolean;
    message: string;
}
  
export interface ApiResponse {
    [key: string]: any;
}