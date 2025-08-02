export const ROLES = {
    USER: "user",
    ADMIN: "admin",
  } as const;
  
  export type RoleType = typeof ROLES[keyof typeof ROLES];
  
  export const EVENT_STATUSES = {
    UPCOMING: "Upcoming",
    ONGOING: "Ongoing",
    COMPLETED: "Completed",
  } as const;
  
  export const BOOKING_STATUS = {
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
  } as const;
  
  export const DATE_FORMAT = "DD-MMM-YYYY";
  