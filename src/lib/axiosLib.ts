import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;

export const axiosPost = async (url: any, payload: any, config?: any) =>
  await axios.post(url, payload, config);
export const axiosGet = async (url: any, config?: any) =>
  await axios.get(url, config);
export const axiosDelete = async (url: any, config?: any) =>
  await axios.delete(url, config);
export const axiosPut = async (url: any, payload: any, config?: any) =>
  await axios.put(url, payload, config);
export const axiosPatch = async (url: any, payload: any, config?: any) =>
  await axios.patch(url, payload, config);