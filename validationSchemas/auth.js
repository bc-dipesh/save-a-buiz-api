import yup from 'yup';
import { mobilePhoneNumberRegEx } from '../utils/regex.js';

/**
 * Schema to validate login request body.
 */
const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please provide a valid email address.')
    .required('Please provide a email address.'),
  password: yup.string().required('Please provide a password'),
});

/**
 * Schema to validate register request body.
 */
const registerSchema = yup.object().shape({
  name: yup.string().required('Please provide a name.'),
  email: yup.string().email('Please provide a valid email.').required('Please provide a email.'),
  mobilePhoneNumber: yup
    .string()
    .matches(mobilePhoneNumberRegEx, 'Please provide a valid mobile phone number.'),
  password: yup.string().required('Please provide a password.'),
});

/**
 * Schema to validate password update request body.
 */
const passwordUpdateSchema = yup.object().shape({
  currentPassword: yup.string().required('Please provide your current password.'),
  newPassword: yup.string().required('Please provide your new password.'),
});

export { loginSchema, registerSchema, passwordUpdateSchema };
