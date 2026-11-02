import api from './axiosInstance';

/**
 * Payment APIs.
 *
 * Covers seeker payment history, seeker & mentor invoices,
 * and mentor payout account management.
 */

export interface PaymentHistoryParams {
  search?: string;
  page?: number;
  limit?: number;
}

/** Get seeker transaction and payment history. */
export const getSeekerPaymentHistory = (params?: PaymentHistoryParams) =>
  api.get('/payment/seeker/history', {params});

/** Download / view seeker invoice by order ID. */
export const getSeekerInvoice = (orderId: string) =>
  api.get(`/payment/seeker/invoice/${orderId}`);

/** Download / view mentor invoice by order ID. */
export const getMentorInvoice = (orderId: string) =>
  api.get(`/payment/mentor/invoice/${orderId}`);

/** Add Razorpay linked route account for mentor payouts. */
export const createRazorpayPayoutAccount = (data: object) =>
  api.post('/mentor/add-account', data);

/** Add or update mentor bank account details for direct settlements. */
export const addMentorBankDetails = (data: {
  account_number: string;
  ifsc_code: string;
  beneficiary_name: string;
  pan_number: string;
  gst_number?: string;
}) => api.post('/mentor/add-bank-details', data);
