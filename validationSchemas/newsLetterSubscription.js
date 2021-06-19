import yup from 'yup';

/**
 * Schema to validate newsletter subscription request body.
 */
const newsLetterSubscriptionSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please provide a valid email address.')
    .required('Please provide a email address.'),
});

export default newsLetterSubscriptionSchema;
