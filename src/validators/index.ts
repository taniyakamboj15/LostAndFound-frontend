import * as yup from 'yup';
import { ItemCategory } from '@constants/categories';

// Login Schema
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  rememberMe: yup.boolean(),
});

// Register Schema
export const registerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  phone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional(),
});

// Item Schema
export const itemSchema = yup.object({
  category: yup
    .string()
    .oneOf(Object.values(ItemCategory), 'Invalid category')
    .required('Category is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .required('Description is required'),
  locationFound: yup
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(200, 'Location must not exceed 200 characters')
    .required('Location is required'),
  dateFound: yup
    .string()
    .required('Date found is required')
    .test('not-future', 'Date cannot be in the future', (val) => {
      if (!val) return false;
      return new Date(val) <= new Date();
    }),
  isHighValue: yup.boolean().required(),
  estimatedValue: yup
    .number()
    .positive('Value must be positive')
    .when('isHighValue', {
      is: true,
      then: (schema) => schema.required('Estimated value is required for high-value items'),
      otherwise: (schema) => schema.optional(),
    }),
  photos: yup.array().optional(),
  storageLocation: yup.string().nullable().optional(),
  finderName: yup.string().optional(),
  finderContact: yup.string().optional(),
  identifyingFeatures: yup.string().optional(),
});

export const editItemSchema = itemSchema.shape({
  status: yup.string().required('Status is required'),
});

// Lost Report Schema
export const lostReportSchema = yup.object({
  category: yup
    .string()
    .oneOf(Object.values(ItemCategory), 'Invalid category')
    .required('Category is required'),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .required('Description is required'),
  locationLost: yup
    .string()
    .min(3, 'Location must be at least 3 characters')
    .max(200, 'Location must not exceed 200 characters')
    .required('Location is required'),
  dateLost: yup
    .mixed<Date>()
    .test('is-date', 'Date lost is required', (val) => val instanceof Date || (typeof val === 'string' && !isNaN(Date.parse(val))))
    .transform((val) => (val instanceof Date ? val : new Date(val)))
    .test('not-future', 'Date cannot be in the future', (val) => {
        if (!val) return false;
        return val <= new Date();
    })
    .required('Date lost is required'),
  contactEmail: yup
    .string()
    .email('Invalid email address')
    .required('Contact email is required'),
  contactPhone: yup
    .string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional(),
  identifyingFeatures: yup
    .array()
    .of(yup.string().min(3, 'Feature must be at least 3 characters').required())
    .min(1, 'At least one identifying feature is required')
    .default([])
    .required(),
});

// Senior Dev Practice: Refine schema for the specific form structure
export const createReportFormSchema = lostReportSchema.shape({
  identifyingFeatures: yup.array().of(
    yup.object({
      text: yup.string().min(3, 'Feature must be at least 3 characters').required()
    })
  ).min(1, 'At least one identifying feature is required').required()
});

// Claim Schema
export const claimSchema = yup.object({
  itemId: yup.string().optional(),
  description: yup
    .string()
    .min(10, 'Description must be at least 10 characters')
    .required('Description is required'),
  lostReportId: yup.string().optional(),
});

// Pickup Schema
export const pickupSchema = yup.object({
  claimId: yup.string().required('Claim ID is required'),
  pickupDate: yup
    .date()
    .min(new Date(), 'Pickup date must be in the future')
    .required('Pickup date is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
});

export const userSchema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: yup.string().oneOf(['STAFF', 'ADMIN'], 'Invalid role').required('Role is required'),
}).required();

export const storageSchema = yup.object({
  name: yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
  location: yup.string().min(3, 'Location must be at least 3 characters').required('Location is required'),
  shelfNumber: yup.string().optional(),
  binNumber: yup.string().optional(),
  capacity: yup.number().positive('Capacity must be positive').required('Capacity is required'),
  isActive: yup.boolean().required(),
});

export const reportSchema = lostReportSchema;