import { ChangeEventHandler, FormEvent } from "react";
import * as yup from "yup";

export type ReactStateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

export type ReactState<T> = [T, ReactStateSetter<T>];

export type OnInputChangeHandler = ChangeEventHandler<
  HTMLInputElement | HTMLTextAreaElement
>;

export type OnFormSubmitEvent = FormEvent<HTMLFormElement>;

export const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address.")
    .required("An email address is required."),
});

export type EmailSchema = yup.InferType<typeof emailSchema>;

export const validateEmail = async (email: string) => {
  return emailSchema
    .validate({ email }, { abortEarly: false })
    .then(() => null)
    .catch((err) => err.errors);
};

export interface DeleteResponse {
  status: "success" | "error";
  message: string;
}
