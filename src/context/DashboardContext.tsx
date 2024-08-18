import React from "react";
import { CurrentUser } from "../lib/definitions";

export const DashboardContext = React.createContext<{
  user: CurrentUser | null;
  logout: () => void;
}>({ user: null, logout: () => {} });
