// Principal interface
export interface Principal {
  id: string;
  username: string;
  name: string;
  email: string;
}

export interface CurrentUser {
  principal: Principal;
  grant: "user" | "client";
  authorities: string[];
}
