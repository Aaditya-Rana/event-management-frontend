export interface Event {
    _id: string;
    eventId:string;
    title: string;
    description?: string;
    location?: string;
    date: string;
    isOnline?: boolean;
    capacity?: number;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: any;
  }