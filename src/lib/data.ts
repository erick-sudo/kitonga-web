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
