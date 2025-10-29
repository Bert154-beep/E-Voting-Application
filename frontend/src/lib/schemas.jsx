import {z} from 'zod'

export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required!").email("Invalid email format!"),
  password: z.string().min(1, "Password is required!"),
});

export const SignUpSchema = z
  .object({
    fullname: z.string().min(1, "Full name is required!").max(100),
    father_name: z.string().min(1, "Father name is required!").max(100),
    mother_name: z.string().min(1, "Mother name is required!").max(100),
    date_of_birth: z
      .string()
      .min(1, "Date of birth is required!")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    cnic_number: z
      .string()
      .min(13, "CNIC number must be at least 13 digits!")
      .max(15, "CNIC number must be at most 15 digits!"),
    password: z.string().min(6, "Password must be at least 6 characters!"),
    confirm_password: z.string().min(1, "Please confirm your password!"),
    email_address: z
      .string()
      .min(1, "Email is required!")
      .email("Invalid email format!"),
    phone_no: z.string().min(1, "Phone number is required!").max(20),
    role: z.enum(["voter", "admin"]).default("voter"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match!",
    path: ["confirm_password"], 
  });