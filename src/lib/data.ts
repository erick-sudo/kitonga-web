import { APIS } from "./apis";
import { axiosGet } from "./axiosLib";
import { CurrentUser } from "./definitions";

export const fetchCurrentUser: () => Promise<CurrentUser | null> = async () => {
  return axiosGet(APIS.account.getCurrentUser)
    .then((axiosResponse) => {
      return axiosResponse.data;
    })
    .catch((_) => {
      // Ignore error
      return null;
    });
};

export const caseStates = [
  { name: "Pre Filing", icon: "faSearch" },
  { name: "Filing", icon: "faFile" },
  { name: "Pleadings", icon: "faFileText" },
  { name: "Discovery", icon: "faFolderOpen" },
  { name: "Pre Trial Motions", icon: "faGavel" },
  { name: "Trial", icon: "faBalanceScale" },
  { name: "Verdict", icon: "faGavel" },
  { name: "Appeal", icon: "faUndo" },
  { name: "Enforcement", icon: "faBriefcase" },
  { name: "Post Judgment Motions", icon: "faGavel" },
  { name: "Settlement", icon: "faHandshake" },
  { name: "Closed", icon: "faBoxArchive" },
];

export const paymentMethods = ["Cash", "Mpesa", "CreditCard", "DebitCard"];

export const filterFields = {
  matchColumns: {
    case: [
      "id",
      "title",
      "description",
      "case_no_or_parties",
      "record",
      "file_reference",
      "clients_reference",
      "status",
      "created_at",
      "updated_at",
    ],
    paymentInformation: [
      "outstanding",
      "paid_amount",
      "total_fee",
      "deposit_pay",
      "deposit_fees",
      "final_fees",
      "final_pay",
      "deposit",
    ],
  },
  rangeableColumns: {
    case: ["created_at", "updated_at"],
    paymentInformation: [
      "outstanding",
      "paid_amount",
      "total_fee",
      "deposit_pay",
      "deposit_fees",
      "final_fees",
      "final_pay",
      "deposit",
      "created_at",
      "updated_at",
    ],
  },
  responseColumns: {
    case: [
      "id",
      "title",
      "description",
      "case_no_or_parties",
      "record",
      "file_reference",
      "clients_reference",
      "status",
      "client_id",
      "created_at",
      "updated_at",
    ],
    paymentInformation: [
      "payment_type",
      "outstanding",
      "paid_amount",
      "total_fee",
      "deposit_pay",
      "deposit_fees",
      "final_fees",
      "final_pay",
      "deposit",
      "created_at",
      "updated_at",
    ],
  },
};
