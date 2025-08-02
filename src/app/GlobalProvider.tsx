"use client";

import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { store} from "@/redux/store";
import { fetchCurrentUser } from "@/redux/slices/authSlice";

export default function GlobalProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    store.dispatch(fetchCurrentUser());
  }, []);
  
  return <Provider store={store}>{children}</Provider>;
}
