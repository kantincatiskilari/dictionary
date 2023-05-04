import * as Yup from 'yup';

export const registerSchema = Yup.object({
        registerNickname: Yup
        .string()
        .required("nickname is required."),
        registerPassword: Yup
        .string()
        .min(6,"Password must consist at least 6 characters.")
        .max(12,"Password can contain up to 12 characters.")
        .required("Password is required"),
        registerEmail: Yup
        .string()
        .email("Email is not valid.")
        .required("Email is required.")
        .matches(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-]+)(\.[a-zA-Z]{2,5}){1,2}$/,"Email is not valid."),
});