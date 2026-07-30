import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  registrationNumber: z.string().regex(/^[0-9]{2}[A-Z]{3}[0-9]{4}$/i, "Invalid Registration Number (e.g., 23BCE1234)"),
  phoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
  branch: z.string().min(2, "Branch is required"),
  year: z.string().min(1, "Year is required"),
  
  // Department Selections
  department1: z.string().min(1, "First department is required"),
  department2: z.string().min(1, "Second department is required"),

}).refine(data => data.department1 !== data.department2, {
  message: "You must select two DIFFERENT departments",
  path: ["department2"]
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;
