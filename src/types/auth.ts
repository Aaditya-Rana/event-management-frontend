import { RoleType } from "@/lib/constants";

export interface AuthUser {
  name: string;
  email: string;
  role: RoleType;
}
