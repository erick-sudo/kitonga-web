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

export interface Case {
  id: string;
  title: string;
  description: string;
  case_no_or_parties: string;
  record: string;
  file_reference: string;
  clients_reference: string;
  client_id: string;
  status: string;
  payment_initialized: boolean;
  created_at: string;
  updated_at: string;
}

export interface Client {}
