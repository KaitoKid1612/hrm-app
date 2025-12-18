import { z } from 'zod';

/**
 * Common validation schemas and helpers
 */

// ============= String Validations =============

export const emailSchema = z.string().min(1, 'Email is required').email('Invalid email format');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z.string().regex(/^[0-9]{10,11}$/, 'Phone number must be 10-11 digits');

export const urlSchema = z.string().url('Invalid URL format').or(z.literal(''));

export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only');

// ============= Number Validations =============

export const positiveNumberSchema = z.number().positive('Must be a positive number');

export const salarySchema = z
  .number()
  .min(0, 'Salary must be at least 0')
  .max(1000000000, 'Salary is too large');

// ============= Date Validations =============

export const futureDateSchema = z
  .date()
  .refine((date) => date > new Date(), 'Date must be in the future');

export const pastDateSchema = z
  .date()
  .refine((date) => date < new Date(), 'Date must be in the past');

// ============= File Validations =============

export const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5000000, 'File size must be less than 5MB')
  .refine(
    (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
    'Only JPEG, PNG, and WebP images are allowed',
  );

export const pdfFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 10000000, 'File size must be less than 10MB')
  .refine((file) => file.type === 'application/pdf', 'Only PDF files are allowed');

// ============= Array Validations =============

export const nonEmptyArraySchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.array(schema).min(1, 'At least one item is required');

// ============= Object Validations =============

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().regex(/^[0-9]{5,6}$/, 'Invalid zip code'),
  country: z.string().min(1, 'Country is required'),
});

// ============= Helper Functions =============

/**
 * Create a required string field
 */
export const requiredString = (fieldName: string, minLength = 1) =>
  z.string().min(minLength, `${fieldName} is required`);

/**
 * Create an optional string field
 */
export const optionalString = () => z.string().optional().or(z.literal(''));

/**
 * Create a required number field
 */
export const requiredNumber = (fieldName: string) =>
  z.coerce.number({ message: `${fieldName} is required` });

/**
 * Create an optional number field
 */
export const optionalNumber = () => z.coerce.number().optional();

/**
 * Create a date field that can accept string or Date
 */
export const dateField = () => z.coerce.date();

/**
 * Create a select/enum field
 */

export const selectField = <T extends readonly [string, ...string[]]>(
  values: T,
  fieldName: string,
) => z.enum(values, { message: `${fieldName} is required` });

/**
 * Password confirmation validation
 */

export const passwordConfirmation = <T extends { password: string }>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodObject<any>,
) =>
  schema
    .merge(z.object({ confirmPassword: z.string() }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .refine((data: any) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    });

/**
 * Validate that end date is after start date
 */
export const dateRangeValidation = <T extends { startDate: Date; endDate: Date }>(
  schema: z.ZodType<T>,
) =>
  schema.refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

/**
 * Transform empty strings to undefined (useful for optional fields)
 */
export const emptyStringToUndefined = z
  .string()
  .transform((val) => (val === '' ? undefined : val))
  .optional();

/**
 * Validate Vietnamese phone number
 */
export const vietnamesePhoneSchema = z
  .string()
  .regex(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/, 'Invalid Vietnamese phone number');

/**
 * Validate Vietnamese ID card number
 */
export const vietnameseIdCardSchema = z.string().regex(/^[0-9]{9,12}$/, 'Invalid ID card number');

// ============= Export All =============

export const validationSchemas = {
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema,
  url: urlSchema,
  slug: slugSchema,
  positiveNumber: positiveNumberSchema,
  salary: salarySchema,
  futureDate: futureDateSchema,
  pastDate: pastDateSchema,
  imageFile: imageFileSchema,
  pdfFile: pdfFileSchema,
  address: addressSchema,
  vietnamesePhone: vietnamesePhoneSchema,
  vietnameseIdCard: vietnameseIdCardSchema,
};
