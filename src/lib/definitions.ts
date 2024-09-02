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

export interface Client extends Principal {
  address: string;
  contact_number: string;
  created_at: string;
  updated_at: string;
}

export interface PartialClient {
  id: string;
  name: string;
}

export interface Population {
  count: number;
}

export type PaymentType = "full" | "deposit" | "installment";

export type PaymentMethod = "Cash" | "Mpesa" | "CreditCard" | "DebitCard";

export interface Payment {
  payment_method: PaymentMethod;
  amount: number;
  payment_type: PaymentType;
}

export interface InitializePaymentInformationDto {
  payment_type: PaymentType;
  total_fee: number;
  payment?: Payment | null;
}

export interface Installment {
  id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_type: PaymentType;
  payment_information_id: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentInformation {
  id: string;
  case_id: string;
  payment_type: PaymentType;
  outstanding: number;
  paid_amount: number;
  total_fee: number;
  cummulative_payments: Installment[] | null;
  deposit_pay: number;
  deposit_fees: number;
  final_fees: number;
  final_pay: number;
  deposit: number;
}
