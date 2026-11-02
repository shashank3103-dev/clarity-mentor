import api from './axiosInstance';

/**
 * Public & Home APIs.
 *
 * Covers mentor discovery, pinned mentors, success stories,
 * newsletter subscriptions, blog listing, and articles.
 */

export interface GetHomeMentorsParams {
  skip?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export interface GetSuccessStoriesParams {
  page?: number;
  limit?: number;
}

export interface GetBlogsParams {
  skip?: number;
  limit?: number;
}

/** Get list of public mentors for the home / explore screen. */
export const getHomeMentors = (params?: GetHomeMentorsParams) =>
  api.get('/home/mentors', {params});

/** Get featured success stories and testimonials. */
export const getSuccessStories = (params?: GetSuccessStoriesParams) =>
  api.get('/home/success-stories', {params});

/** Get curated pinned mentors for the hero / featured section. */
export const getPinnedMentors = () =>
  api.get('/home/pinned-mentors');

/** Subscribe an email address to the Clarity newsletter. */
export const subscribeNewsletter = (email: string) =>
  api.post('/news/subscribe', {email});

/** Get public profile of a mentor by slug. */
export const getPublicMentorProfile = (slug: string) =>
  api.get(`/mentor/profile/${slug}`);

/** Get all mentor profile slugs (sitemap / directory). */
export const getMentorProfileSlugs = () =>
  api.get('/user/mentor-profile-slugs');

/** Get public blogs list. */
export const getBlogs = (params?: GetBlogsParams) =>
  api.get('/blogs', {params});

/** Get a single blog article by ID. */
export const getBlogById = (id: string | number) =>
  api.get('/blog', {params: {id}});
