import api from './axiosInstance';

/**
 * Review APIs.
 *
 * Covers seeker public reviews and internal session goal-outcome feedback.
 */

export interface AddReviewPayload {
  session_id: string | number;
  rating: string | number;
  review: string;
}

export interface ReviewOutcomePayload {
  session_id: string | number;
  rating: number; // 1: Not Helpful, 2: Slightly Helpful, 3: Partially Achieved, 4: Mostly Achieved, 5: Achieved Goal
  feedback: string;
}

/** Submit a public review for a completed session. */
export const addReview = (data: AddReviewPayload) =>
  api.post('/review/add', {
    ...data,
    session_id: String(data.session_id),
    rating: String(data.rating),
  });

/** Submit private outcome evaluation on whether the session achieved the seeker's goal. */
export const addReviewOutcome = (data: ReviewOutcomePayload) =>
  api.post('/review/outcome', data);
