import * as yup from "yup";

export const loginSchema = yup.object().shape({
  email: yup.string().required("User Email is required"),
  password: yup.string().min(6).max(32).required(),
});