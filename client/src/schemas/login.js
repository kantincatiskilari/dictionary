import * as Yup from 'yup';

export const loginSchema = Yup.object({
    nickname: Yup
    .string()
    .required("nickname is required."),
    password: Yup
    .string()
    .required("Password is required")
    .min(6,"Password must consist at least 6 characters.")
    .max(12,"Password can contain up to 12 characters.")
});
