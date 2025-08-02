export interface Booking {
    _id: string;
    user: {
      _id: string;
      name: string;
      email: string;
    };
    event: {
      _id: string;
      title: string;
      date:string;
    };
    seats: number;
    status: string;
    bookedAt: string;
    createdAt?: string;
  }
  
  