export interface Entity {
  id: string;
}

export interface TimeStamps {
  created_at: string;
  updated_at: string;
}

export interface Principal extends Entity {
  username: string;
  name: string;
  email: string;
}

export interface PolicyUser extends Entity {
  username: string;
  email: string;
}

export type PolicyClient = Principal;

export interface User extends Principal, TimeStamps {
  address: string;
  contact_number: string;
}

export interface CurrentUser {
  principal: Principal;
  grant: "user" | "client";
  authorities: string[];
}

export interface GrantedAuthority extends Entity, TimeStamps {
  name: string;
}

export type Role = GrantedAuthority;

export interface Group extends GrantedAuthority {
  roles: Role[];
}

export type PrincipalResourceType = "iam" | "role" | "group" | "client";

export type ResourceType = PrincipalResourceType | "resourceaction" | "case";

export type KRN = `krn:${ResourceType}:${string}:${string}`;

export type ResourceActionKRN = `krn:resourceaction:${string}:${string}`;

export type PrincipalKRN = `krn:${PrincipalResourceType}:${string}:${string}`;

export interface ResourceAction extends Entity, TimeStamps {
  name: string;
}

export interface BriefAccessPolicy extends Entity, TimeStamps {
  name: string;
  effect: "Deny" | "Allow";
  description: string;
}

export interface AccessPolicy extends BriefAccessPolicy {
  actions: ResourceActionKRN[];
  principals: PrincipalKRN[];
  resources: KRN[];
  conditions: string[];
}

export type CreateAccessPolicyDto = Omit<
  AccessPolicy,
  keyof TimeStamps | keyof Entity
>;

export interface RecentCase extends Entity, TimeStamps {
  title: string;
  record: string;
  status: string;
}

export interface Case extends RecentCase {
  description: string;
  case_no_or_parties: string;
  file_reference: string;
  clients_reference: string;
  client_id: string;
  payment_initialized: boolean;
}

export interface Client extends Principal, TimeStamps {
  address: string;
  contact_number: string;
}

export interface PartialClient extends Entity {
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

export interface Installment extends Entity, TimeStamps {
  amount: number;
  payment_method: PaymentMethod;
  payment_type: PaymentType;
  payment_information_id: string;
}

export interface PaymentInformation extends Entity {
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
