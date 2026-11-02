export {default as api} from './axiosInstance';
export type {ApiError} from './axiosInstance';

export * from './authApi';
export * from './seekerApi';
export * from './mentorApi';
export * from './bookingApi';
export * from './conversationApi';
export * from './reviewApi';
export * from './adminApi';

// Payment API specific exports
export {createRazorpayPayoutAccount} from './paymentApi';
export type {PaymentHistoryParams} from './paymentApi';

// Home API specific exports
export {
  getHomeMentors,
  getSuccessStories,
  getPinnedMentors,
  subscribeNewsletter,
  getPublicMentorProfile,
  getBlogs,
  getBlogById,
} from './homeApi';
export type {
  GetHomeMentorsParams,
  GetSuccessStoriesParams,
  GetBlogsParams,
} from './homeApi';
