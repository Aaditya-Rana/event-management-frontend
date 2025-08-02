"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ROLES } from "@/lib/constants";

export const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === ROLES.ADMIN,
    isUser: user?.role === ROLES.USER,
  };
};
